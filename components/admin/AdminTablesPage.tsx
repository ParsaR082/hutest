"use client";

import { useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createAdminTable, fetchAdminTables, type AdminTable } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminTablesPage() {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [label, setLabel] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    const token = getAccessToken();
    if (!token) return Promise.resolve();
    return fetchAdminTables(token).then(setTables);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token || !label) return;
    setSaving(true);
    try {
      await createAdminTable(token, {
        label,
        capacity: Number(capacity) || 2,
        zone,
        is_active: true,
      });
      setLabel("");
      setZone("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Tables" title="مدیریت میزها" />

      <form
        onSubmit={(e) => void handleCreate(e)}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-gray-800 bg-[#111111]/80 p-5"
      >
        <div className="min-w-[140px] flex-1">
          <label className="text-xs text-gray-500">برچسب میز</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
        <div className="w-24">
          <label className="text-xs text-gray-500">ظرفیت</label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label className="text-xs text-gray-500">بخش</label>
          <input
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="سالن اصلی"
            className="mt-1 w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
        <AnimatedButton type="submit" className="px-5 py-2.5 text-[0.65rem]" disabled={saving}>
          {saving ? "..." : "افزودن میز"}
        </AnimatedButton>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-gray-800 bg-[#111111]/80 p-4"
            >
              <p className="font-medium text-white">{t.label}</p>
              <p className="mt-1 text-sm text-gray-400">
                {t.capacity} نفر · {t.zone || "بدون بخش"}
              </p>
              <span
                className={`mt-2 inline-block text-xs ${
                  t.is_active ? "text-emerald-400" : "text-gray-600"
                }`}
              >
                {t.is_active ? "فعال" : "غیرفعال"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
