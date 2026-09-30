"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { fetchAdminOrders, updateAdminOrderStatus } from "@/lib/api/admin";
import type { OrderListItem } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/auth/storage";
import { getAuthenticatedWsUrl } from "@/lib/ws/config";

const KITCHEN_STATUSES = new Set(["pending", "confirmed", "preparing", "ready"]);

export function AdminKitchenPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    const all = await fetchAdminOrders(token);
    setOrders(all.filter((o) => KITCHEN_STATUSES.has(o.status)));
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ws: WebSocket | null = null;
    let closed = false;

    const connect = () => {
      if (closed) return;
      ws = new WebSocket(getAuthenticatedWsUrl("/kitchen/"));
      ws.onmessage = () => void load();
      ws.onclose = () => {
        if (!closed) setTimeout(connect, 5000);
      };
      ws.onerror = () => ws?.close();
    };

    connect();
    return () => {
      closed = true;
      ws?.close();
    };
  }, [load]);

  const advance = async (order: OrderListItem) => {
    const token = getAccessToken();
    if (!token) return;
    const next: Record<string, string> = {
      pending: "preparing",
      confirmed: "preparing",
      preparing: "ready",
      ready: "out_for_delivery",
    };
    const status = next[order.status];
    if (!status) return;

    setUpdatingId(order.id);
    try {
      await updateAdminOrderStatus(token, order.id, { status });
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">KDS</p>
        <h1 className="font-serif mt-2 text-3xl font-bold text-white">تابلوی آشپزخانه</h1>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">سفارش فعالی در آشپزخانه نیست</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-white">
                    {order.order_number}
                  </p>
                  <p className="mt-1 text-sm text-[#F97316]">{order.status_label}</p>
                  <p className="mt-1 text-xs text-gray-500">{order.item_count} آیتم</p>
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  جزئیات
                </Link>
              </div>
              <div className="mt-4">
                <AnimatedButton
                  className="w-full py-2.5 text-[0.65rem]"
                  disabled={updatingId === order.id}
                  onClick={() => void advance(order)}
                >
                  {updatingId === order.id ? "..." : "مرحله بعد"}
                </AnimatedButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
