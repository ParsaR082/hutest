"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { fetchAdminReservations } from "@/lib/api/admin";
import type { Reservation } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/storage";

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("fa-IR");
  } catch {
    return date;
  }
}

export function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminReservations(token)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Reservations" title="مدیریت رزروها" />

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">رزروی ثبت نشده</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">کد</th>
                <th className="px-4 py-3 text-start font-medium">مهمان</th>
                <th className="px-4 py-3 text-start font-medium">تاریخ</th>
                <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                <th className="px-4 py-3 text-start font-medium">میز</th>
                <th className="px-4 py-3 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">{r.reservation_code}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-200">{r.guest_name}</p>
                    <p className="text-xs text-gray-500">{r.guest_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(r.date)} · {r.time.slice(0, 5)} · {r.party_size} نفر
                  </td>
                  <td className="px-4 py-3 text-gray-300">{r.status_label}</td>
                  <td className="px-4 py-3 text-gray-400">{r.table_label ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/reservations/${r.id}`}
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
