"use client";

import { useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RevenueChart, StatusBreakdown } from "@/components/admin/AdminCharts";
import { fetchAdminReports } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminReportsPage() {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<Awaited<ReturnType<typeof fetchAdminReports>> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    fetchAdminReports(token, days)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [days]);

  const exportCsv = () => {
    if (!report) return;
    const rows = [
      ["metric", "value"],
      ["total_revenue", report.total_revenue],
      ["total_orders", report.total_orders],
      ["total_reservations", report.total_reservations],
      ...report.daily_revenue.map((d) => [`revenue_${d.date}`, d.revenue]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humazd-report-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Reports" title="گزارش‌ها">
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                days === d
                  ? "bg-[#F97316] text-white"
                  : "border border-gray-700 text-gray-400"
              }`}
            >
              {d} روز
            </button>
          ))}
          {report && (
            <AnimatedButton className="px-4 py-2 text-[0.65rem]" onClick={exportCsv}>
              CSV
            </AnimatedButton>
          )}
        </div>
      </AdminPageHeader>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : report ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5">
              <p className="text-xs text-gray-500">درآمد</p>
              <p className="font-serif mt-2 text-2xl font-bold text-[#F97316]">
                {report.total_revenue_display}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5">
              <p className="text-xs text-gray-500">سفارش‌ها</p>
              <p className="font-serif mt-2 text-2xl font-bold text-white">
                {report.total_orders}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5">
              <p className="text-xs text-gray-500">رزروها</p>
              <p className="font-serif mt-2 text-2xl font-bold text-white">
                {report.total_reservations}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
              <h2 className="font-serif text-lg font-semibold text-white">درآمد روزانه</h2>
              <div className="mt-6">
                <RevenueChart data={report.daily_revenue} />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6">
              <h2 className="font-serif text-lg font-semibold text-white">سفارش بر اساس وضعیت</h2>
              <div className="mt-4">
                <StatusBreakdown items={report.orders_by_status} />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6 lg:col-span-2">
              <h2 className="font-serif text-lg font-semibold text-white">رزرو بر اساس وضعیت</h2>
              <div className="mt-4 max-w-md">
                <StatusBreakdown items={report.reservations_by_status} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
