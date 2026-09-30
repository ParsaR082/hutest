import { apiFetch } from "./fetch";
import type { PublicSettings } from "./types";

export function fetchPublicSettings() {
  return apiFetch<PublicSettings>("/settings/public/");
}
