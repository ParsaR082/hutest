import { apiFetch } from "./fetch";
import type { Reservation } from "./types";

export function fetchReservations(token: string) {
  return apiFetch<Reservation[]>("/reservations/list/", { token, cache: "no-store" });
}

export function fetchUpcomingReservation(token: string) {
  return apiFetch<Reservation | null>("/reservations/upcoming/", {
    token,
    cache: "no-store",
  });
}

export function cancelReservation(token: string, id: number) {
  return apiFetch<{ cancelled: boolean }>(`/reservations/${id}/`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
