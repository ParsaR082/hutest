"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  fetchAdminOrderDetail,
  updateAdminOrderStatus,
} from "@/lib/api/admin";
import type { OrderDetail } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/storage";

const STATUS_ACTIONS = [
  { status: "confirmed", label: "تأیید" },
  { status: "preparing", label: "آشپزخانه" },
  { status: "ready", label: "آماده" },
  { status: "out_for_delivery", label: "در مسیر" },
  { status: "delivered", label: "تحویل شد" },
  { status: "cancelled", label: "لغو" },
] as const;

export function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const orderId = Number(id);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const token = getAccessToken();
    if (!token) return;
    const data = await fetchAdminOrderDetail(token, orderId);
    setOrder(data);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [orderId]);

  const handleStatus = async (status: string) => {
    const token = getAccessToken();
    if (!token) return;
    setUpdating(status);
    try {
      const updated = await updateAdminOrderStatus(token, orderId, { status });
      setOrder(updated);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-8 py-12 text-center text-gray-500">سفارش یافت نشد</div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <Link
        href="/admin/orders"
        className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-[#F97316]"
      >
        ← بازگشت به لیست
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">{order.order_number}</h1>
          <p className="mt-2 text-sm text-gray-400">وضعیت: {order.status_label}</p>
        </div>
        <p className="font-serif text-2xl font-bold text-[#F97316]">{order.total_display}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            اطلاعات مشتری
          </h2>
          <dl className="mt-4 space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <dt className="text-gray-500">نام</dt>
              <dd>{order.customer.name}</dd>
            </div>
            {order.customer.phone && (
              <div className="flex justify-between">
                <dt className="text-gray-500">تلفن</dt>
                <dd dir="ltr">{order.customer.phone}</dd>
              </div>
            )}
            {order.customer.email && (
              <div className="flex justify-between">
                <dt className="text-gray-500">ایمیل</dt>
                <dd dir="ltr">{order.customer.email}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">نوع سفارش</dt>
              <dd>{order.order_type_label}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            اطلاعات تحویل
          </h2>
          {order.order_type === "delivery" ? (
            <dl className="mt-4 space-y-2 text-sm text-gray-300">
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-gray-500">گیرنده</dt>
                <dd className="text-left">{order.delivery_recipient_name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-gray-500">تلفن</dt>
                <dd dir="ltr">{order.delivery_phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-gray-500">آدرس</dt>
                <dd className="text-left">{order.delivery_address}</dd>
              </div>
              {order.delivery_address_details && (
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-gray-500">جزئیات</dt>
                  <dd className="text-left">{order.delivery_address_details}</dd>
                </div>
              )}
              {order.delivery_notes && (
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-gray-500">یادداشت</dt>
                  <dd className="text-left">{order.delivery_notes}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-gray-500">این سفارش نیاز به ارسال ندارد.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">آیتم‌ها</h2>
          <ul className="mt-4 space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-gray-300">
                <span>
                  {item.name} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            خلاصه مالی
          </h2>
          <dl className="mt-4 space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <dt className="text-gray-500">جمع سفارش</dt>
              <dd>{order.subtotal_display}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">هزینه ارسال</dt>
              <dd>{order.delivery_fee > 0 ? order.delivery_fee_display : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">تخفیف</dt>
              <dd>{order.discount > 0 ? `- ${order.discount_display}` : "—"}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-2 font-medium text-white">
              <dt>مبلغ نهایی</dt>
              <dd>{order.total_display}</dd>
            </div>
            {order.payment && (
              <div className="flex justify-between pt-2">
                <dt className="text-gray-500">وضعیت پرداخت</dt>
                <dd>
                  {order.payment.method_label} · {order.payment.status_label}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
          تغییر وضعیت
        </h2>
        <div className="flex flex-wrap gap-3">
          {STATUS_ACTIONS.map((action) => (
            <AnimatedButton
              key={action.status}
              className="px-5 py-2.5 text-[0.65rem]"
              disabled={updating != null || order.status === action.status}
              onClick={() => void handleStatus(action.status)}
            >
              {updating === action.status ? "..." : action.label}
            </AnimatedButton>
          ))}
        </div>
      </div>
    </div>
  );
}
