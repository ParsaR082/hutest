import { apiFetch } from "./fetch";

export type Notification = {
  id: number;
  title: string;
  body: string;
  notification_type: string;
  is_read: boolean;
  link: string;
  created_at: string;
};

export function fetchNotifications(token: string) {
  return apiFetch<Notification[]>("/notifications/", { token, cache: "no-store" });
}

export function markNotificationRead(token: string, id: number) {
  return apiFetch<{ read: boolean }>(`/notifications/${id}/read/`, {
    method: "PATCH",
    token,
    cache: "no-store",
  });
}
