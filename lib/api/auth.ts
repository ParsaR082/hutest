import { apiFetch } from "./fetch";
import type { AuthTokens, UserProfile } from "./types";

export type LoginResponse = {
  tokens: AuthTokens;
  user?: UserProfile;
};

export type RegisterResponse = {
  tokens: AuthTokens;
  user: UserProfile;
};

export function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/auth/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
}

export function register(data: {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  return apiFetch<RegisterResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export function requestOtp(phone: string) {
  return apiFetch<{ phone: string; expires_in: number }>("/auth/otp/request/", {
    method: "POST",
    body: JSON.stringify({ phone }),
    cache: "no-store",
  });
}

export function verifyOtp(phone: string, code: string) {
  return apiFetch<RegisterResponse & { created: boolean }>("/auth/otp/verify/", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
    cache: "no-store",
  });
}

export function logout(refreshToken: string, accessToken: string) {
  return apiFetch<{ message: string }>("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
    token: accessToken,
    cache: "no-store",
  });
}
