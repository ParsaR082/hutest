import { apiFetch } from "./fetch";
import type { BlogPostAdmin, BlogPostDetail, BlogPostList } from "./types";

export function fetchBlogList() {
  return apiFetch<BlogPostList[]>("/blog/");
}

export function fetchBlogPost(slug: string) {
  return apiFetch<BlogPostDetail>(`/blog/${slug}/`);
}

export function fetchAdminBlogList(token: string) {
  return apiFetch<BlogPostAdmin[]>("/admin/blog/", { token, cache: "no-store" });
}

export function fetchAdminBlogPost(token: string, id: number) {
  return apiFetch<BlogPostAdmin>(`/admin/blog/${id}/`, { token, cache: "no-store" });
}

export function createAdminBlogPost(
  token: string,
  data: Partial<Omit<BlogPostAdmin, "id" | "created_at" | "updated_at">>
) {
  return apiFetch<BlogPostAdmin>("/admin/blog/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminBlogPost(
  token: string,
  id: number,
  data: Partial<Omit<BlogPostAdmin, "id" | "created_at" | "updated_at">>
) {
  return apiFetch<BlogPostAdmin>(`/admin/blog/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminBlogPost(token: string, id: number) {
  return apiFetch<{ deleted: boolean }>(`/admin/blog/${id}/`, {
    method: "DELETE",
    token,
  });
}
