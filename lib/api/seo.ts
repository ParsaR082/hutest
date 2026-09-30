import { apiFetch } from "./fetch";
import type { SEOPageKey, SEOSetting } from "./types";

export function fetchPublicSEO(pageKey: SEOPageKey) {
  return apiFetch<Partial<SEOSetting>>(`/seo/${pageKey}/`);
}

export function fetchAdminSEOList(token: string) {
  return apiFetch<SEOSetting[]>("/admin/seo/", { token, cache: "no-store" });
}

export function fetchAdminSEO(token: string, pageKey: SEOPageKey) {
  return apiFetch<SEOSetting>(`/admin/seo/${pageKey}/`, { token, cache: "no-store" });
}

export function updateAdminSEO(
  token: string,
  pageKey: SEOPageKey,
  data: Partial<
    Pick<
      SEOSetting,
      | "seo_title"
      | "meta_description"
      | "canonical_url"
      | "og_title"
      | "og_description"
      | "og_image"
      | "twitter_image"
      | "robots_index"
      | "robots_follow"
      | "structured_data"
    >
  >
) {
  return apiFetch<SEOSetting>(`/admin/seo/${pageKey}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}
