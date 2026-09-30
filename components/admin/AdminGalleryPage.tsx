"use client";

import { useEffect, useState } from "react";
import { Plus, Star, Trash2, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  fetchAdminGallery,
  updateAdminGalleryItem,
} from "@/lib/api/gallery";
import { getAccessToken } from "@/lib/auth/storage";
import type { GalleryCategory, GalleryItemAdmin } from "@/lib/api/types";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  food: "غذا",
  interior: "فضای داخلی",
  exterior: "نمای بیرونی",
  atmosphere: "فضا و حس‌وحال",
  events: "رویدادها",
  team: "تیم ما",
  special_dishes: "بشقاب‌های ویژه",
  behind_the_scenes: "پشت صحنه",
};

const EMPTY_FORM = {
  image: "",
  title: "",
  description: "",
  category: "food" as GalleryCategory,
  alt_text: "",
  sort_order: 0,
  is_visible: true,
  is_featured: false,
};

function ItemForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: GalleryItemAdmin | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    if (!form.image.trim()) {
      setError("آدرس تصویر الزامی است.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await updateAdminGalleryItem(token, initial.id, form);
      } else {
        await createAdminGalleryItem(token, form);
      }
      onSaved();
    } catch {
      setError("خطا در ذخیره‌سازی.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mb-8 rounded-2xl border border-gray-800 bg-[#111111]/60 p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-white">
          {initial ? "ویرایش تصویر" : "افزودن تصویر جدید"}
        </h2>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <MediaPicker
            label="تصویر گالری *"
            value={form.image || null}
            onChange={(media) => set("image", media?.url ?? "")}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">عنوان</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">دسته‌بندی</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as GalleryCategory)}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500">توضیحات</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">متن جایگزین تصویر (Alt Text)</label>
          <input
            value={form.alt_text}
            onChange={(e) => set("alt_text", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">ترتیب نمایش</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => set("is_visible", e.target.checked)}
              className="h-4 w-4 accent-[#F97316]"
            />
            نمایش در سایت
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 accent-[#F97316]"
            />
            ویژه (نمایش در بخش برگزیده‌ها)
          </label>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6">
        <AnimatedButton type="submit" className="px-8 py-3 text-xs" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </AnimatedButton>
      </div>
    </form>
  );
}

export function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItemAdmin | null | undefined>(undefined);

  const load = async () => {
    const token = getAccessToken();
    if (!token) return;
    setItems(await fetchAdminGallery(token));
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    const token = getAccessToken();
    if (!token) return;
    if (!confirm("این تصویر حذف شود؟")) return;
    await deleteAdminGalleryItem(token, id);
    await load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader
        eyebrow="Gallery"
        title="مدیریت گالری"
        description="تصاویری که اینجا اضافه و «نمایش در سایت» فعال باشد، در صفحه گالری عمومی نمایش داده می‌شود."
      >
        {editing === undefined && (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            افزودن تصویر
          </button>
        )}
      </AdminPageHeader>

      {editing !== undefined && (
        <ItemForm
          initial={editing}
          onCancel={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            void load();
          }}
        />
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">هنوز تصویری اضافه نشده است.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gray-800 bg-[#111111]/80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.alt_text || item.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                {item.is_featured && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F97316] text-white">
                    <Star className="h-3 w-3" fill="currentColor" />
                  </span>
                )}
                {!item.is_visible && (
                  <span className="rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] text-gray-300">
                    پنهان
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-white" title={item.title}>
                  {item.title || "—"}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-[#F97316]">
                  {CATEGORY_LABELS[item.category]}
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] text-white hover:bg-[#F97316]"
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(item.id)}
                  aria-label="حذف"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
