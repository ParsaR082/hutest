"use client";

import Link from "next/link";
import { ActiveOrderTracker } from "@/components/dashboard/ActiveOrderTracker";
import type { ActiveOrder } from "@/lib/dashboard-data";

export function ActiveOrdersPanel({
  order,
  isLive,
}: {
  order: ActiveOrder | null;
  isLive?: boolean;
}) {
  if (!order) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-[#111111]/40 p-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gray-500">
          بدون سفارش فعال
        </p>
        <h3 className="font-serif mt-3 text-2xl font-bold text-white">
          سفارشی در حال پیگیری نیست
        </h3>
        <Link
          href="/menu"
          className="mt-6 text-xs font-medium uppercase tracking-widest text-[#F97316] transition hover:underline"
        >
          سفارش از منو ←
        </Link>
      </div>
    );
  }

  return <ActiveOrderTracker order={order} isLive={isLive} />;
}
