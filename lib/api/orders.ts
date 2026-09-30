import { apiFetch } from "./fetch";
import type { OrderDetail } from "./types";

export type OrderListItem = {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  order_type: string;
  order_type_label: string;
  total: number;
  total_display: string;
  placed_at: string;
  item_count: number;
  customer_name: string;
  customer_phone: string;
};

export function fetchOrders(token: string, status?: "active" | "completed") {
  const query = status ? `?status=${status}` : "";
  return apiFetch<OrderListItem[]>(`/orders/${query}`, { token, cache: "no-store" });
}

export function fetchActiveOrder(token: string) {
  return apiFetch<OrderDetail | null>("/orders/active/", { token, cache: "no-store" });
}

export function fetchOrderDetail(token: string, id: number) {
  return apiFetch<OrderDetail>(`/orders/${id}/`, { token, cache: "no-store" });
}

export type CheckoutPayload = {
  order_type?: string;
  notes?: string;
  payment_method?: "cash" | "card" | "online" | "wallet";
  recipient_name?: string;
  phone?: string;
  address?: string;
  address_details?: string;
  delivery_notes?: string;
};

export function checkoutOrder(token: string, data?: CheckoutPayload) {
  return apiFetch<OrderDetail>("/orders/checkout/", {
    method: "POST",
    body: JSON.stringify(data ?? {}),
    token,
    cache: "no-store",
  });
}

export function initiatePayment(token: string, orderId: number) {
  return apiFetch<{ redirect_url: string; authority: string }>(`/orders/${orderId}/pay/`, {
    method: "POST",
    token,
    cache: "no-store",
  });
}

export function verifyPayment(authority: string, status: string) {
  return apiFetch<OrderDetail>("/orders/pay/verify/", {
    method: "POST",
    body: JSON.stringify({ authority, status }),
    cache: "no-store",
  });
}

export function reorderOrder(token: string, orderId: number) {
  return apiFetch<unknown>(`/orders/${orderId}/reorder/`, {
    method: "POST",
    token,
    cache: "no-store",
  });
}
