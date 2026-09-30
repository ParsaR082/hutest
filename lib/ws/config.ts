import { getAccessToken } from "@/lib/auth/storage";

export function getWsBaseUrl() {
  return process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";
}

/** Builds an authenticated websocket URL by appending the current access
 * token as a query param, since these sockets don't carry cookies/headers. */
export function getAuthenticatedWsUrl(path: string) {
  const token = getAccessToken();
  const base = `${getWsBaseUrl()}${path}`;
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
}
