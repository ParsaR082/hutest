"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  fetchAdminReservation,
  fetchAdminTables,
  updateAdminReservation,
  type AdminTable,
} from "@/lib/api/admin";
import type { Reservation } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/storage";

const STATUS_ACTIONS = [
  { status: "confirmed", label: "تأیید" },
  { status: "seated", label: "نشسته" },
  { status: "completed", label: "تکمیل" },
  { status: "cancelled", label: "لغو" },
  { status: "no_show", label: "عدم حضور" },
] as const;

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("fa-IR");
  } catch {
    return date;
  }
}

export function AdminReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reservationId = Number(id);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [tableId, setTableId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    Promise.all([
      fetchAdminReservation(token, reservationId),
      fetchAdminTables(token),
    ])
      .then(([res, tbls]) => {
        setReservation(res);
        setTables(tbls);
        setTableId(res.table_id != null ? String(res.table_id) : "");
      })
      .finally(() => setLoading(false));
  }, [reservationId]);

  const handleStatus = async (status: string) => {
    const token = getAccessToken();
    if (!token) return;
    setUpdating(status);
    try {
      const updated = await updateAdminReservation(token, reservationId, {
        status,
      });
      setReservation(updated);
    } finally {
      setUpdating(null);
    }
  };

  const handleAssignTable = async () => {
    const token = getAccessToken();
    if (!token || !tableId) return;
    setUpdating("table");
    try {
      const updated = await updateAdminReservation(token, reservationId, {
        table_id: Number(tableId),
      });
      setReservation(updated);
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

  if (!reservation) {
    return (
      <div className="px-8 py-12 text-center text-gray-500">
        رزرو یافت نشد
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <Link
        href="/admin/reservations"
        className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-[#F97316]"
      >
        ← بازگشت به لیست
      </Link>

      <div className="mt-6">
        <h1 className="font-serif text-3xl font-bold text-white">
          {reservation.reservation_code}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {reservation.status_label}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            اطلاعات مهمان
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">نام</dt>
              <dd className="text-white">{reservation.guest_name}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">تلفن</dt>
              <dd className="text-white">{reservation.guest_phone}</dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">تاریخ</dt>
              <dd className="text-white">
                {formatDate(reservation.date)} ·{" "}
                {reservation.time.slice(0, 5)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">تعداد</dt>
              <dd className="text-white">{reservation.party_size} نفر</dd>
            </div>

            {reservation.special_requests && (
              <div>
                <dt className="text-gray-500">درخواست ویژه</dt>
                <dd className="mt-1 text-gray-300">
                  {reservation.special_requests}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
            تخصیص میز
          </h2>

          <div className="mt-4 flex gap-3">
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="flex-1 rounded-xl border border-gray-700 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
            >
              <option value="">انتخاب میز</option>

              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.capacity} نفر)
                </option>
              ))}
            </select>

            <AnimatedButton
              className="px-5 py-2.5 text-[0.65rem]"
              disabled={!tableId || updating === "table"}
              onClick={() => void handleAssignTable()}
            >
              {updating === "table" ? "..." : "ثبت"}
            </AnimatedButton>
          </div>

          <p className="mt-2 text-xs text-gray-600">
            میز فعلی: {reservation.table_label ?? "تخصیص نشده"}
          </p>
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
              disabled={
                updating != null || reservation.status === action.status
              }
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

