"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { useBookingOptional } from "@/components/booking/BookingProvider";
import type { Reservation } from "@/lib/dashboard-data";

export function ReservationsPanel({
  reservations,
  onCancel,
  cancellingId,
}: {
  reservations: Reservation[];
  onCancel: (id: number) => void;
  cancellingId: number | null;
}) {
  const booking = useBookingOptional();

  if (reservations.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-[#111111]/40 p-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gray-500">
          بدون رزرو
        </p>
        <h3 className="font-serif mt-3 text-2xl font-bold text-white">
          رزرو فعالی ندارید
        </h3>
        <button
          type="button"
          onClick={() => booking?.openBooking()}
          className="mt-6 text-xs font-medium uppercase tracking-widest text-[#F97316] transition hover:underline"
        >
          رزرو میز جدید ←
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((res) => (
        <div
          key={res.id}
          className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#111111]/80 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#F97316]/30 bg-[#F97316]/10">
              <CalendarDays className="h-5 w-5 text-[#F97316]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{res.id}</p>
              <p className="font-serif mt-1 text-lg font-semibold text-white">
                {res.date}
              </p>
              <p className="mt-0.5 text-sm text-gray-400">
                {res.time} · {res.guests} نفر · {res.tableLabel}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${
                  res.status === "confirmed"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {res.status === "confirmed" ? "تأیید شده" : "در انتظار"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => booking?.openBooking()}
              className="rounded-lg border border-gray-700 px-4 py-2 text-xs text-gray-400 transition hover:border-gray-500 hover:text-white"
            >
              رزرو جدید
            </button>
            {res.reservationId != null && (
              <button
                type="button"
                disabled={cancellingId === res.reservationId}
                onClick={() => onCancel(res.reservationId!)}
                className="rounded-lg border border-red-900/50 px-4 py-2 text-xs text-red-400 transition hover:bg-red-950/30 disabled:opacity-50"
              >
                {cancellingId === res.reservationId ? "در حال لغو..." : "لغو"}
              </button>
            )}
          </div>
        </div>
      ))}
      <Link
        href="/contact"
        className="block text-center text-xs text-gray-600 hover:text-[#F97316]"
      >
        برای تغییر رزرو با پشتیبانی تماس بگیرید
      </Link>
    </div>
  );
}
