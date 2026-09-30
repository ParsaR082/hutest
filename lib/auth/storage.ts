const ACCESS_KEY = "humazd_access_token";
const REFRESH_KEY = "humazd_refresh_token";
const USER_KEY = "humazd_user";

import type { UserProfile } from "@/lib/api/types";

export function saveAuthSession(tokens: { access: string; refresh: string }, user?: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
  document.cookie = `humazd_auth=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "humazd_auth=; path=/; max-age=0; SameSite=Lax";
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function updateStoredUser(user: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
