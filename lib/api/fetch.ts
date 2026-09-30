import { ApiError } from "./client";

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string; details?: unknown };
};

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
}

/** Bounds every API call so one slow/unreachable backend can't hang a page render indefinitely. */
const REQUEST_TIMEOUT_MS = 8000;

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(customHeaders ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    signal: rest.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: rest.method && rest.method !== "GET" ? undefined : { revalidate: 60 },
  });

  const json: ApiEnvelope<T> = await res.json();

  if (!json.success) {
    throw new ApiError(
      json.error ?? { code: "UNKNOWN", message: "Request failed" }
    );
  }

  return json.data as T;
}
