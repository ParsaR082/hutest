"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { fetchAdminCustomers } from "@/lib/api/admin";
import type { UserProfile } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminCustomers(token)
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="CRM" title="مشتریان" />

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-gray-500">مشتری یافت نشد</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">نام</th>
                <th className="px-4 py-3 text-start font-medium">ایمیل</th>
                <th className="px-4 py-3 text-start font-medium">سطح</th>
                <th className="px-4 py-3 text-start font-medium">عضویت</th>
                <th className="px-4 py-3 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">
                    {[c.first_name, c.last_name].filter(Boolean).join(" ") || c.username}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.email}</td>
                  <td className="px-4 py-3 text-[#F97316]">{c.tier_label}</td>
                  <td className="px-4 py-3 text-gray-500">{c.member_since}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-[#F97316]"
                    >
                      پروفایل
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
