import { apiFetch } from "./fetch";
import type { UserProfile } from "./types";

export function fetchMe(token: string) {
  return apiFetch<UserProfile>("/users/me/", { token, cache: "no-store" });
}

export function updateMe(
  token: string,
  data: Partial<Pick<UserProfile, "first_name" | "last_name" | "phone">>
) {
  return apiFetch<UserProfile>("/users/me/", {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}
