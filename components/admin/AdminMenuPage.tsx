"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  deleteAdminMenuItem,
  fetchAdminMenu,
  updateAdminMenuItem,
  type AdminMenuItem,
} from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminMenuPage() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminMenu(token)
      .then(setItems)
      .catch(() => setError("خطا در بارگذاری منو."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleAvailable = async (item: AdminMenuItem) => {
    const token = getAccessToken();
    if (!token) return;
    setBusyId(item.id);
    setError(null);
    const nextValue = !item.is_available;
    try {
      await updateAdminMenuItem(token, item.id, { is_available: nextValue });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: nextValue } : i))
      );
    } catch {
      setError("خطا در تغییر وضعیت.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSortOrderChange = async (item: AdminMenuItem, value: string) => {
    const sortOrder = Number(value);
    if (Number.isNaN(sortOrder)) return;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, sort_order: sortOrder } : i))
    );
    const token = getAccessToken();
    if (!token) return;
    try {
      await updateAdminMenuItem(token, item.id, { sort_order: sortOrder });
    } catch {
      setError("خطا در تغییر ترتیب نمایش.");
    }
  };

  const handleDelete = async (item: AdminMenuItem) => {
    if (!window.confirm(`آیا از حذف «${item.name}» مطمئن هستید؟`)) return;
    const token = getAccessToken();
    if (!token) return;
    setBusyId(item.id);
    setError(null);
    try {
      await deleteAdminMenuItem(token, item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      setError("خطا در حذف آیتم.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminPageHeader eyebrow="Menu" title="مدیریت منو" />
        <Link
          href="/admin/menu/new"
          className="rounded-xl bg-[#F97316] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#F97316]/90"
        >
          + افزودن غذای جدید
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">هنوز هیچ غذایی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">نام</th>
                <th className="px-4 py-3 text-start font-medium">دسته</th>
                <th className="px-4 py-3 text-start font-medium">قیمت</th>
                <th className="px-4 py-3 text-start font-medium">ترتیب</th>
                <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                <th className="px-4 py-3 text-start font-medium">برچسب</th>
                <th className="px-4 py-3 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">{item.name}</td>
                  <td className="px-4 py-3 text-gray-400">{item.category}</td>
                  <td className="px-4 py-3 text-[#F97316]">{item.price_display}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={item.sort_order ?? 0}
                      onBlur={(e) => void handleSortOrderChange(item, e.target.value)}
                      className="w-16 rounded-lg border border-gray-800 bg-[#111111] px-2 py-1.5 text-xs text-white outline-none focus:border-[#F97316]/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => void handleToggleAvailable(item)}
                      className={`rounded-full px-3 py-1 text-[0.65rem] font-medium transition ${
                        item.is_available
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-gray-700/40 text-gray-400 hover:bg-gray-700/60"
                      }`}
                    >
                      {item.is_available ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.is_featured && (
                        <span className="rounded bg-[#F97316]/15 px-2 py-0.5 text-[0.65rem] text-[#F97316]">
                          ویژه
                        </span>
                      )}
                      {item.is_best_seller && (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] text-emerald-400">
                          پرفروش
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/menu/${item.id}`}
                        className="text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-[#F97316]"
                      >
                        ویرایش
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => void handleDelete(item)}
                        className="text-xs font-medium uppercase tracking-wider text-gray-600 hover:text-red-400"
                      >
                        حذف
                      </button>
                    </div>
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
