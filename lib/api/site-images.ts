import { apiFetch } from "./fetch";

export type SiteImageSlot = {
  slug: string;
  group: "homepage" | "about" | "booking" | "global";
  label: string;
  media_id: number | null;
  url: string | null;
  updated_at: string;
};

export function fetchSiteImages() {
  return apiFetch<Record<string, string>>("/site-images/");
}

export function fetchAdminSiteImages(token: string) {
  return apiFetch<SiteImageSlot[]>("/admin/site-images/", { token, cache: "no-store" });
}

export function updateAdminSiteImage(token: string, slug: string, mediaId: number | null) {
  return apiFetch<SiteImageSlot>(`/admin/site-images/${slug}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ media_id: mediaId }),
  });
}
