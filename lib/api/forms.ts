import { apiFetch } from "./fetch";

export function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  return apiFetch<{ submitted: boolean }>("/contact/", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export function subscribeNewsletter(email: string) {
  return apiFetch<{ subscribed: boolean }>("/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
}

export function createReservation(data: {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
}) {
  return apiFetch<unknown>("/reservations/", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}
