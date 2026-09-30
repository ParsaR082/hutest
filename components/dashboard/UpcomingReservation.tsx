"use client";

import { CalendarDays } from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import { images } from "@/lib/images";
import type { Reservation } from "@/lib/dashboard-data";

export function UpcomingReservation({
  reservation,
  onEdit,
  onCancel,
  isCancelling,
}: {
  reservation: Reservation;
  onEdit?: () => void;
  onCancel?: () => void;
  isCancelling?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111111]/80 backdrop-blur-md">
      <div className="absolute inset-0 opacity-[0.07]">
        <LocalImage
          src={images.about.interior}
          alt=""
          fill
          className="object-cover"
          sizes="400px"
        />
      </div>

      <div className="relative flex items-stretch gap-5 p-6 sm:p-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#F97316]/30 bg-[#F97316]/10">
          <CalendarDays className="h-6 w-6 text-[#F97316]" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F97316]">
            رزرو بعدی
          </p>
          <p className="font-serif mt-2 text-xl font-semibold text-white sm:text-2xl">
            {reservation.date}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {reservation.time} · میز برای {reservation.guests} نفر
          </p>
          <p className="mt-0.5 text-xs text-gray-600">{reservation.tableLabel}</p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${
              reservation.status === "confirmed"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {reservation.status === "confirmed" ? "تأیید شده" : "در انتظار تأیید"}
          </span>

          {(onEdit || onCancel) && (
            <div className="mt-5 flex flex-wrap gap-4 text-xs">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-gray-400 transition hover:text-white hover:underline hover:decoration-[#F97316] hover:underline-offset-4"
                >
                  رزرو جدید
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isCancelling}
                  className="text-gray-400 transition hover:text-red-400 hover:underline hover:underline-offset-4 disabled:opacity-50"
                >
                  {isCancelling ? "در حال لغو..." : "لغو"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
