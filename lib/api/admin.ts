import { apiFetch } from "./fetch";
import type { MenuItemList, PublicSettings, Reservation, UserProfile } from "./types";
import type { OrderDetail } from "./types";
import type { OrderListItem } from "./orders";

export type AdminDashboardStats = {
  revenue_today: number;
  revenue_change_pct: number;
  orders_today: number;
  orders_change_pct: number;
  reservations_today: number;
  new_customers_today: number;
  pending_orders: number;
  avg_order_value: number;
};

export type AdminDashboardCharts = {
  revenue: { date: string; revenue: number }[];
  popular_dishes: { items__name: string; count: number }[];
};

export type AdminTable = {
  id: number;
  label: string;
  capacity: number;
  zone: string;
  is_active: boolean;
};

export type AdminContact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

export type AdminMenuItem = MenuItemList & {
  is_available?: boolean;
  sort_order?: number;
  long_description?: string;
};

export function fetchAdminStats(token: string) {
  return apiFetch<AdminDashboardStats>("/admin/dashboard/stats/", {
    token,
    cache: "no-store",
  });
}

export function fetchAdminCharts(token: string, days = 7) {
  return apiFetch<AdminDashboardCharts>(`/admin/dashboard/charts/?days=${days}`, {
    token,
    cache: "no-store",
  });
}

export function fetchAdminOrders(token: string, status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<OrderListItem[]>(`/admin/orders/${query}`, {
    token,
    cache: "no-store",
  });
}

export function fetchAdminOrderDetail(token: string, id: number) {
  return apiFetch<OrderDetail>(`/admin/orders/${id}/`, { token, cache: "no-store" });
}

export function updateAdminOrderStatus(
  token: string,
  id: number,
  data: { status: string; note?: string; estimated_minutes?: number }
) {
  return apiFetch<OrderDetail>(`/admin/orders/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function fetchAdminReservations(token: string) {
  return apiFetch<Reservation[]>("/admin/reservations/", { token, cache: "no-store" });
}

export function fetchAdminReservation(token: string, id: number) {
  return apiFetch<Reservation>(`/admin/reservations/${id}/`, { token, cache: "no-store" });
}

export function updateAdminReservation(
  token: string,
  id: number,
  data: { status?: string; table_id?: number }
) {
  return apiFetch<Reservation>(`/admin/reservations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function fetchAdminTables(token: string) {
  return apiFetch<AdminTable[]>("/admin/tables/", { token, cache: "no-store" });
}

export function fetchAdminMenu(token: string) {
  return apiFetch<AdminMenuItem[]>("/admin/menu/", { token, cache: "no-store" });
}

export function fetchAdminMenuItem(token: string, id: number) {
  return apiFetch<Record<string, unknown>>(`/admin/menu/${id}/`, {
    token,
    cache: "no-store",
  });
}

export function createAdminMenuItem(token: string, data: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/admin/menu/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function updateAdminMenuItem(
  token: string,
  id: number,
  data: Record<string, unknown>
) {
  return apiFetch<Record<string, unknown>>(`/admin/menu/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function deleteAdminMenuItem(token: string, id: number) {
  return apiFetch<{ deleted: boolean }>(`/admin/menu/${id}/`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}

export function fetchAdminCustomers(token: string) {
  return apiFetch<UserProfile[]>("/admin/customers/", { token, cache: "no-store" });
}

export function fetchAdminCustomer(token: string, id: number) {
  return apiFetch<UserProfile>(`/admin/customers/${id}/`, { token, cache: "no-store" });
}

export function fetchAdminContacts(token: string) {
  return apiFetch<AdminContact[]>("/admin/contacts/", { token, cache: "no-store" });
}

export function fetchAdminSettings(token: string) {
  return apiFetch<PublicSettings>("/admin/settings/", { token, cache: "no-store" });
}

export function updateAdminSettings(
  token: string,
  data: {
    restaurant_name?: string;
    logo_url?: string;
    phone?: string;
    email?: string;
    address?: string;
    lat?: number;
    lng?: number;
    social_instagram?: string;
    social_twitter?: string;
    social_facebook?: string;
    social_youtube?: string;
    delivery_fee?: number;
    free_delivery_threshold?: number;
  }
) {
  return apiFetch<PublicSettings>("/admin/settings/", {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export type AdminReportSummary = {
  period_days: number;
  total_revenue: number;
  total_revenue_display: string;
  total_orders: number;
  total_reservations: number;
  orders_by_status: { status: string; count: number }[];
  reservations_by_status: { status: string; count: number }[];
  daily_revenue: { date: string; revenue: number }[];
};

export type AdminAuditLog = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  actor: string | null;
  created_at: string;
};

export type AdminTestimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
};

export function fetchAdminReports(token: string, days = 30) {
  return apiFetch<AdminReportSummary>(`/admin/reports/summary/?days=${days}`, {
    token,
    cache: "no-store",
  });
}

export function fetchAdminAuditLogs(token: string) {
  return apiFetch<AdminAuditLog[]>("/admin/audit-logs/", { token, cache: "no-store" });
}

export function fetchAdminTestimonials(token: string) {
  return apiFetch<AdminTestimonial[]>("/admin/testimonials/", { token, cache: "no-store" });
}

export function createAdminTestimonial(
  token: string,
  data: Omit<AdminTestimonial, "id">
) {
  return apiFetch<AdminTestimonial>("/admin/testimonials/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function fetchAdminStaff(token: string) {
  return apiFetch<UserProfile[]>("/admin/staff/", { token, cache: "no-store" });
}

export function createAdminStaff(
  token: string,
  data: {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    role: string;
  }
) {
  return apiFetch<UserProfile>("/admin/staff/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function createAdminTable(
  token: string,
  data: { label: string; capacity: number; zone?: string; is_active?: boolean }
) {
  return apiFetch<AdminTable>("/admin/tables/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
    cache: "no-store",
  });
}

export function updateAdminCustomerTier(token: string, id: number, tier: string) {
  return apiFetch<UserProfile>(`/admin/customers/${id}/tier/`, {
    method: "PATCH",
    body: JSON.stringify({ tier }),
    token,
    cache: "no-store",
  });
}
