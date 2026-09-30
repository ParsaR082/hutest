const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(error: { code: string; message: string; details?: unknown }) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.details = error.details;
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string; details?: unknown };
};

export async function apiClient<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(customHeaders ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const json: ApiEnvelope<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.error ?? { code: "UNKNOWN", message: "Request failed" });
  }

  return json.data as T;
}

export function getApiBaseUrl() {
  return API_BASE;
}

export function getWsBaseUrl() {
  return process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";
}
