import { apiFetch } from "./fetch";
import type { MenuItemDetail, MenuItemList } from "./types";

export function fetchMenuItems(category?: string) {
  const query = category && category !== "all" ? `?category=${category}` : "";
  return apiFetch<MenuItemList[]>(`/menu/${query}`);
}

export function fetchFeaturedMenu() {
  return apiFetch<MenuItemList[]>("/menu/featured/");
}

export function fetchMenuBySlug(slug: string) {
  return apiFetch<MenuItemDetail>(`/menu/${slug}/`);
}

export function fetchAllMenuSlugs() {
  return fetchMenuItems().then((items) => items.map((item) => item.slug));
}
