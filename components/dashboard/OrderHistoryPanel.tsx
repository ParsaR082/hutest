"use client";

import Link from "next/link";
import { OrderHistoryWidget } from "@/components/dashboard/OrderHistoryWidget";
import type { OrderHistoryItem } from "@/lib/dashboard-data";

export function OrderHistoryPanel({
  orders,
  onReorder,
  reorderingId,
}: {
  orders: OrderHistoryItem[];
  onReorder: (orderId: number) => void;
  reorderingId: number | null;
}) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-[#111111]/40 p-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gray-500">
          تاریخچه خالی
        </p>
        <h3 className="font-serif mt-3 text-2xl font-bold text-white">
          هنوز سفارشی ثبت نشده
        </h3>
        <Link
          href="/menu"
          className="mt-6 text-xs font-medium uppercase tracking-widest text-[#F97316] transition hover:underline"
        >
          اولین سفارش ←
        </Link>
      </div>
    );
  }

  return (
    <OrderHistoryWidget
      orders={orders}
      onReorder={onReorder}
      reorderingId={reorderingId}
    />
  );
}
