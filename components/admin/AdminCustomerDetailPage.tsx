"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { fetchAdminCustomer, updateAdminCustomerTier } from "@/lib/api/admin";
import type { UserProfile } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customerId = Number(id);
  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [tier, setTier] = useState("standard");
  const [loading, setLoading] = useState(true);
  const [savingTier, setSavingTier] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminCustomer(token, customerId)
      .then((c) => {
        setCustomer(c);
        setTier(c.tier);
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleTierSave = async () => {
    const token = getAccessToken();
    if (!token) return;
    setSavingTier(true);
    try {
      const updated = await updateAdminCustomerTier(token, customerId, tier);
      setCustomer(updated);
    } finally {
      setSavingTier(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  if (!customer) {
    return <div className="px-8 py-12 text-center text-gray-500">مشتری یافت نشد</div>;
  }

  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.username;

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <Link
        href="/admin/customers"
        className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-[#F97316]"
      >
        ← بازگشت به لیست
      </Link>

      <div className="mt-6">
        <h1 className="font-serif text-3xl font-bold text-white">{fullName}</h1>
        <p className="mt-2 text-sm text-[#F97316]">{customer.tier_label}</p>
      </div>

      <div className="mt-8 max-w-lg rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">ایمیل</dt>
            <dd className="text-white">{customer.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">تلفن</dt>
            <dd className="text-white">{customer.phone ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">نام کاربری</dt>
            <dd className="text-white">{customer.username}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">عضویت از</dt>
            <dd className="text-white">{customer.member_since}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">نقش</dt>
            <dd className="text-white">{customer.role}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 max-w-lg rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">سطح VIP</h2>
        <div className="mt-4 flex gap-3">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="flex-1 rounded-xl border border-gray-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
          >
            <option value="standard">Standard</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="vip">VIP</option>
          </select>
          <AnimatedButton
            className="px-5 py-2.5 text-[0.65rem]"
            disabled={savingTier || tier === customer.tier}
            onClick={() => void handleTierSave()}
          >
            {savingTier ? "..." : "ذخیره"}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
