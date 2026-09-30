import { apiFetch } from "./fetch";

export type CartItem = {
  id: number;
  menu_item: number;
  menu_item_name: string;
  menu_item_slug: string;
  quantity: number;
  notes: string;
  unit_price: number;
  price_display: string;
};

export type Cart = {
  id: number;
  items: CartItem[];
  total: number;
  total_display: string;
};

export function fetchCart(token: string) {
  return apiFetch<Cart>("/cart/", { token, cache: "no-store" });
}

export function addCartItem(
  token: string,
  data: { menu_item_id: number; quantity?: number; notes?: string }
) {
  return apiFetch<Cart>("/cart/items/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function updateCartItem(token: string, itemId: number, quantity: number) {
  return apiFetch<Cart>(`/cart/items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
    token,
    cache: "no-store",
  });
}

export function removeCartItem(token: string, itemId: number) {
  return apiFetch<Cart>(`/cart/items/${itemId}/`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
