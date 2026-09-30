"use client";

import { useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { fetchAdminSEOList, updateAdminSEO } from "@/lib/api/seo";
import { getAccessToken } from "@/lib/auth/storage";
import type { SEOPageKey, SEOSetting } from "@/lib/api/types";

const PAGE_LABELS: Record<SEOPageKey, string> = {
  home: "صفحه اصلی",
  menu: "منو",
  about: "درباره ما",
  contact: "تماس با ما",
  gallery: "گالری",
  blog: "وبلاگ",
};

const PAGE_ORDER: SEOPageKey[] = ["home", "menu", "about", "contact", "gallery", "blog"];

function TextField({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      {hint && <p className="mt-0.5 text-[0.7rem] text-gray-600">{hint}</p>}
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
      />
    </div>
  );
}

function EditForm({
  setting,
  onSaved,
}: {
  setting: SEOSetting;
  onSaved: (updated: SEOSetting) => void;
}) {
  const [form, setForm] = useState(setting);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setForm(setting);
    setMessage(null);
  }, [setting]);

  const set = <K extends keyof SEOSetting>(key: K, value: SEOSetting[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateAdminSEO(token, form.page_key, {
        seo_title: form.seo_title,
        meta_description: form.meta_description,
        canonical_url: form.canonical_url,
        og_title: form.og_title,
        og_description: form.og_description,
        og_image: form.og_image,
        twitter_image: form.twitter_image,
        robots_index: form.robots_index,
        robots_follow: form.robots_follow,
        structured_data: form.structured_data,
      });
      onSaved(updated);
      setMessage("ذخیره شد.");
    } catch {
      setMessage("خطا در ذخیره.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSave(e)} className="space-y-6">
      <div className="rounded-2xl border border-gray-800 bg-[#111111]/60 p-6">
        <h2 className="font-serif text-base font-semibold text-white">سئوی پایه</h2>
        <div className="mt-5 space-y-5">
          <TextField
            label="عنوان سئو (SEO Title)"
            value={form.seo_title}
            onChange={(e) => set("seo_title", e.target.value)}
          />
          <div>
            <label className="text-xs text-gray-500">توضیحات متا (Meta Description)</label>
            <textarea
              value={form.meta_description}
              onChange={(e) => set("meta_description", e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
          <TextField
            label="آدرس کنونیکال (Canonical URL)"
            placeholder="https://..."
            value={form.canonical_url}
            onChange={(e) => set("canonical_url", e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#111111]/60 p-6">
        <h2 className="font-serif text-base font-semibold text-white">
          Open Graph / اشتراک‌گذاری شبکه‌های اجتماعی
        </h2>
        <div className="mt-5 space-y-5">
          <TextField
            label="عنوان Open Graph"
            hint="در صورت خالی بودن، از عنوان سئو استفاده می‌شود."
            value={form.og_title}
            onChange={(e) => set("og_title", e.target.value)}
          />
          <div>
            <label className="text-xs text-gray-500">توضیحات Open Graph</label>
            <textarea
              value={form.og_description}
              onChange={(e) => set("og_description", e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
          <MediaPicker
            label="تصویر Open Graph"
            hint="نمایش در پیش‌نمایش لینک هنگام اشتراک‌گذاری."
            value={form.og_image || null}
            onChange={(media) => set("og_image", media?.url ?? "")}
          />
          <MediaPicker
            label="تصویر توییتر/X"
            value={form.twitter_image || null}
            onChange={(media) => set("twitter_image", media?.url ?? "")}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#111111]/60 p-6">
        <h2 className="font-serif text-base font-semibold text-white">موتورهای جستجو</h2>
        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.robots_index}
              onChange={(e) => set("robots_index", e.target.checked)}
              className="h-4 w-4 accent-[#F97316]"
            />
            نمایه‌سازی شود (Index)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.robots_follow}
              onChange={(e) => set("robots_follow", e.target.checked)}
              className="h-4 w-4 accent-[#F97316]"
            />
            لینک‌ها دنبال شوند (Follow)
          </label>
        </div>
        <div className="mt-5">
          <label className="text-xs text-gray-500">
            داده ساخت‌یافته (Structured Data / JSON-LD) — اختیاری
          </label>
          <textarea
            value={form.structured_data}
            onChange={(e) => set("structured_data", e.target.value)}
            rows={4}
            dir="ltr"
            placeholder='{"@context": "https://schema.org", "@type": "Restaurant", ...}'
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 font-mono text-xs text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("خطا") ? "text-red-400" : "text-emerald-400"}`}>
          {message}
        </p>
      )}
      <AnimatedButton type="submit" className="px-8 py-3 text-xs" disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </AnimatedButton>
    </form>
  );
}

export function AdminSEOPage() {
  const [pages, setPages] = useState<SEOSetting[] | null>(null);
  const [active, setActive] = useState<SEOPageKey>("home");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminSEOList(token).then(setPages);
  }, []);

  if (!pages) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  const activeSetting = pages.find((p) => p.page_key === active);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader
        eyebrow="SEO"
        title="مدیریت سئو"
        description="این مقادیر مستقیماً در HTML صفحه عمومی (تگ‌های title، meta و Open Graph) قرار می‌گیرند."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {PAGE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              active === key
                ? "bg-[#F97316] text-white"
                : "border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {PAGE_LABELS[key]}
          </button>
        ))}
      </div>

      {activeSetting && (
        <div className="max-w-xl">
          <EditForm
            key={activeSetting.page_key}
            setting={activeSetting}
            onSaved={(updated) =>
              setPages((prev) =>
                prev ? prev.map((p) => (p.page_key === updated.page_key ? updated : p)) : prev
              )
            }
          />
        </div>
      )}
    </div>
  );
}
