"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAdminOrders } from "@/lib/api/admin";
import type { OrderListItem } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/auth/storage";

const STATUS_FILTERS = [
  { value: "", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "preparing", label: "در آشپزخانه" },
  { value: "delivered", label: "تحویل شده" },
] as const;

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    fetchAdminOrders(token, status || undefined)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
            Orders
          </p>
          <h1 className="font-serif mt-2 text-3xl font-bold text-white">مدیریت سفارش‌ها</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                status === f.value
                  ? "bg-[#F97316] text-white"
                  : "border border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">سفارشی یافت نشد</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">شماره</th>
                <th className="px-4 py-3 text-start font-medium">مشتری</th>
                <th className="px-4 py-3 text-start font-medium">نوع</th>
                <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                <th className="px-4 py-3 text-start font-medium">مبلغ</th>
                <th className="px-4 py-3 text-start font-medium">آیتم</th>
                <th className="px-4 py-3 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">{order.order_number}</td>
                  <td className="px-4 py-3 text-gray-300">
                    <div>{order.customer_name}</div>
                    {order.customer_phone && (
                      <div className="text-xs text-gray-500" dir="ltr">
                        {order.customer_phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{order.order_type_label}</td>
                  <td className="px-4 py-3 text-gray-300">{order.status_label}</td>
                  <td className="px-4 py-3 text-[#F97316]">{order.total_display}</td>
                  <td className="px-4 py-3 text-gray-400">{order.item_count}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-[#F97316]"
                    >
                      جزئیات
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
