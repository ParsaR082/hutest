"use client";

import { AnimatedButton } from "@/components/ui/AnimatedButton";
import type { OrderHistoryItem } from "@/lib/dashboard-data";

export function OrderHistoryWidget({
  orders,
  onReorder,
  reorderingId,
  showViewAll,
  onViewAll,
}: {
  orders: OrderHistoryItem[];
  onReorder?: (orderId: number) => void;
  reorderingId?: number | null;
  showViewAll?: boolean;
  onViewAll?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6 backdrop-blur-md sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
          سفارش‌های اخیر
        </h3>
        {showViewAll && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium uppercase tracking-widest text-gray-500 transition hover:text-[#F97316]"
          >
            مشاهده همه
          </button>
        )}
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-800/80 bg-[#0a0a0a]/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                  {order.date}
                </p>
                <span className="hidden text-gray-700 sm:inline">·</span>
                <p className="text-xs text-gray-600">{order.id}</p>
              </div>
              <p className="mt-1.5 truncate text-sm text-gray-300">{order.dishes}</p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
              <p className="font-serif text-lg font-bold text-[#F97316]">
                {order.price}
              </p>
              {onReorder && order.orderId != null && (
                <AnimatedButton
                  className="px-5 py-2.5 text-[0.6rem]"
                  onClick={() => onReorder(order.orderId!)}
                  disabled={reorderingId === order.orderId}
                >
                  {reorderingId === order.orderId ? "..." : "سفارش مجدد"}
                </AnimatedButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
