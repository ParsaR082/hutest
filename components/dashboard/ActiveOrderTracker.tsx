"use client";

import type { ActiveOrder } from "@/lib/dashboard-data";
import { ORDER_STATUS_STEPS_DELIVERY, ORDER_STATUS_STEPS_STANDARD } from "@/lib/dashboard-data";

export function ActiveOrderTracker({
  order,
  isLive,
}: {
  order: ActiveOrder;
  isLive?: boolean;
}) {
  const steps = order.orderType === "delivery" ? ORDER_STATUS_STEPS_DELIVERY : ORDER_STATUS_STEPS_STANDARD;
  const statusIndex = Math.max(0, order.statusIndex);

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6 backdrop-blur-md sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F97316]">
              سفارش زنده
            </p>
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            )}
          </div>
          <h3 className="font-serif mt-2 text-2xl font-bold text-white sm:text-3xl">
            {order.dishName}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            شماره سفارش · <span className="text-gray-400">{order.id}</span>
          </p>
        </div>
        <div className="rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5 text-xs font-medium text-[#F97316]">
          زمان تقریبی {order.estimatedMinutes} دقیقه
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {order.items.join(" · ")}
      </p>

      <div className="mt-10">
        <div className="relative flex items-start justify-between">
          <div className="absolute left-0 right-0 top-[11px] h-px bg-gray-800" aria-hidden />
          <div
            className="absolute left-0 top-[11px] h-px bg-[#F97316] transition-all duration-700"
            style={{
              width: `${(statusIndex / (steps.length - 1)) * 100}%`,
            }}
            aria-hidden
          />

          {steps.map((step, index) => {
            const isPast = index < statusIndex;
            const isActive = index === statusIndex;
            const isFuture = index > statusIndex;

            return (
              <div
                key={step}
                className="relative z-10 flex flex-1 flex-col items-center px-px"
              >
                <div className="relative flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6">
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-40" />
                  )}
                  <span
                    className={`relative flex h-2.5 w-2.5 items-center justify-center rounded-full sm:h-3 sm:w-3 ${
                      isPast || isActive
                        ? "bg-[#F97316]"
                        : "border border-gray-700 bg-[#0a0a0a]"
                    } ${isActive ? "ring-2 ring-[#F97316]/50 ring-offset-2 ring-offset-[#111111]" : ""}`}
                  />
                </div>
                <p
                  className={`mt-2 max-w-[3.4rem] text-center text-[0.55rem] leading-[1.15] break-words sm:mt-3 sm:max-w-none sm:text-xs ${
                    isFuture ? "text-gray-600" : "text-gray-300"
                  } ${isActive ? "font-medium text-[#F97316]" : ""}`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-600">ثبت شده {order.placedAt}</p>
    </div>
  );
}
