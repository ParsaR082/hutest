import { ApiError } from "./client";
import {
  clearAuthSession,
  getRefreshToken,
  saveAuthSession,
} from "@/lib/auth/storage";

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type RefreshResponse = {
  tokens: {
    access: string;
    refresh: string;
  };
};

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
}

/** Bounds every API call so one slow/unreachable backend can't hang a page render indefinitely. */
const REQUEST_TIMEOUT_MS = 8000;

/**
 * When multiple requests receive 401 at the same time, they should all
 * wait for the same refresh request instead of refreshing independently.
 */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/auth/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
          cache: "no-store",
        });

        if (!res.ok) {
          clearAuthSession();
          return null;
        }

        const json: ApiEnvelope<RefreshResponse> = await res.json();

        if (
          !json.success ||
          !json.data?.tokens?.access ||
          !json.data?.tokens?.refresh
        ) {
          clearAuthSession();
          return null;
        }

        saveAuthSession(json.data.tokens);

        return json.data.tokens.access;
      } catch {
        clearAuthSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function performRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ response: Response; json: ApiEnvelope<T> }> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(customHeaders ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    signal: rest.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next:
      rest.method && rest.method !== "GET"
        ? undefined
        : { revalidate: 60 },
  });

  const json: ApiEnvelope<T> = await response.json();

  return {
    response,
    json,
  };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token } = options;

  let currentToken = token;

  let { response, json } = await performRequest<T>(path, {
    ...options,
    token: currentToken,
  });

  /*
   * Only attempt token refresh for authenticated requests.
   * Public requests should never trigger the refresh flow.
   */
  if (response.status === 401 && currentToken && typeof window !== "undefined") {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      currentToken = newAccessToken;

      ({ response, json } = await performRequest<T>(path, {
        ...options,
        token: currentToken,
      }));
    }
  }

  if (!json.success) {
    throw new ApiError(
      json.error ?? {
        code: response.status === 401 ? "UNAUTHORIZED" : "UNKNOWN",
        message:
          response.status === 401
            ? "احراز هویت نامعتبر یا منقضی شده است."
            : "Request failed",
      }
    );
  }

  return json.data as T;
}