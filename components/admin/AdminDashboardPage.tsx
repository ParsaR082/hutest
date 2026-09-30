"use client";

import { useEffect, useState } from "react";
import { formatToman } from "@/lib/format-price";
import { fetchAdminCharts, fetchAdminStats, type AdminDashboardStats } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";
import { useAdminEventsSocket } from "@/lib/hooks/useAdminEventsSocket";
import { RevenueChart } from "@/components/admin/AdminCharts";

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-500">{label}</p>
      <p className="font-serif mt-2 text-2xl font-bold text-white">{value}</p>
      {change != null && (
        <p
          className={`mt-1 text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
        >
          {change >= 0 ? "+" : ""}
          {change}% نسبت به دیروز
        </p>
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [popular, setPopular] = useState<{ name: string; count: number }[]>([]);
  const [revenue, setRevenue] = useState<{ date: string; revenue: number }[]>([]);
  const [feed, setFeed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const [statsData, charts] = await Promise.all([
        fetchAdminStats(token),
        fetchAdminCharts(token),
      ]);
      setStats(statsData);
      setPopular(
        charts.popular_dishes.map((d) => ({
          name: d.items__name ?? "—",
          count: d.count,
        }))
      );
      setRevenue(charts.revenue);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useAdminEventsSocket((event) => {
    const order = event.order as { order_number?: string; status_label?: string };
    const label =
      event.event === "order_created"
        ? `سفارش جدید: ${order.order_number}`
        : `به‌روزرسانی: ${order.order_number} — ${order.status_label}`;
    setFeed((prev) => [label, ...prev].slice(0, 8));
    void load();
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
          Analytics
        </p>
        <h1 className="font-serif mt-2 text-3xl font-bold text-white">داشبورد مدیریت</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="درآمد امروز"
            value={formatToman(stats.revenue_today)}
            change={stats.revenue_change_pct}
          />
          <StatCard
            label="سفارش‌های امروز"
            value={String(stats.orders_today)}
            change={stats.orders_change_pct}
          />
          <StatCard
            label="رزروهای امروز"
            value={String(stats.reservations_today)}
          />
          <StatCard
            label="سفارش در انتظار"
            value={String(stats.pending_orders)}
          />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="font-serif text-lg font-semibold text-white">درآمد ۷ روز اخیر</h2>
          <div className="mt-6">
            <RevenueChart data={revenue} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="font-serif text-lg font-semibold text-white">غذاهای پرفروش</h2>
          <ul className="mt-4 space-y-2">
            {popular.length === 0 ? (
              <li className="text-sm text-gray-500">داده‌ای موجود نیست</li>
            ) : (
              popular.map((d) => (
                <li
                  key={d.name}
                  className="flex items-center justify-between text-sm text-gray-300"
                >
                  <span>{d.name}</span>
                  <span className="text-[#F97316]">{d.count}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
          <h2 className="font-serif text-lg font-semibold text-white">رویدادهای زنده</h2>
          <ul className="mt-4 space-y-2">
            {feed.length === 0 ? (
              <li className="text-sm text-gray-500">در انتظار رویداد جدید...</li>
            ) : (
              feed.map((item, i) => (
                <li key={`${item}-${i}`} className="text-sm text-gray-400">
                  {item}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
