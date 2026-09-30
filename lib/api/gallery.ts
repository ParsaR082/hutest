import { apiFetch } from "./fetch";
import type { GalleryCategory, GalleryItem, GalleryItemAdmin } from "./types";

export function fetchGallery(category?: GalleryCategory) {
  const query = category ? `?category=${category}` : "";
  return apiFetch<GalleryItem[]>(`/gallery/${query}`);
}

export function fetchAdminGallery(token: string) {
  return apiFetch<GalleryItemAdmin[]>("/admin/gallery/", { token, cache: "no-store" });
}

export function createAdminGalleryItem(
  token: string,
  data: Partial<Omit<GalleryItemAdmin, "id" | "created_at" | "updated_at">>
) {
  return apiFetch<GalleryItemAdmin>("/admin/gallery/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminGalleryItem(
  token: string,
  id: number,
  data: Partial<Omit<GalleryItemAdmin, "id" | "created_at" | "updated_at">>
) {
  return apiFetch<GalleryItemAdmin>(`/admin/gallery/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminGalleryItem(token: string, id: number) {
  return apiFetch<{ deleted: boolean }>(`/admin/gallery/${id}/`, {
    method: "DELETE",
    token,
  });
}
