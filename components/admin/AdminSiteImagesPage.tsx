"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { fetchAdminSiteImages, updateAdminSiteImage, type SiteImageSlot } from "@/lib/api/site-images";
import { getAccessToken } from "@/lib/auth/storage";

const GROUP_LABELS: Record<SiteImageSlot["group"], string> = {
  homepage: "صفحه اصلی",
  about: "درباره ما",
  booking: "رزرو میز",
  global: "عمومی",
};

const GROUP_ORDER: SiteImageSlot["group"][] = ["homepage", "about", "booking", "global"];

export function AdminSiteImagesPage() {
  const [slots, setSlots] = useState<SiteImageSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminSiteImages(token)
      .then(setSlots)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = async (slug: string, media: { url: string; id: number } | null) => {
    const token = getAccessToken();
    if (!token) return;
    setSavingSlug(slug);
    try {
      const updated = await updateAdminSiteImage(token, slug, media?.id ?? null);
      setSlots((prev) => prev.map((s) => (s.slug === slug ? updated : s)));
    } finally {
      setSavingSlug(null);
    }
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
        eyebrow="Site Images"
        title="تصاویر سایت"
        description="این بخش تصاویر ثابتی از وب‌سایت را که پیش‌تر فقط از طریق کد قابل تغییر بودند مدیریت می‌کند — مانند تصویر اصلی صفحه اصلی، تصاویر صفحه درباره ما و بنر رزرو. تا زمانی که تصویری انتخاب نشود، تصویر پیش‌فرض سایت نمایش داده می‌شود."
      />

      <div className="max-w-3xl space-y-8">
        {GROUP_ORDER.map((group) => {
          const groupSlots = slots.filter((s) => s.group === group);
          if (groupSlots.length === 0) return null;
          return (
            <div key={group} className="rounded-2xl border border-gray-800 bg-[#111111]/60 p-6">
              <h2 className="font-serif text-base font-semibold text-white">{GROUP_LABELS[group]}</h2>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {groupSlots.map((slot) => (
                  <div key={slot.slug} className="relative">
                    <MediaPicker
                      label={slot.label}
                      value={slot.url}
                      onChange={(media) => void handleChange(slot.slug, media)}
                    />
                    {savingSlug === slot.slug && (
                      <span className="absolute end-0 top-0 text-[0.65rem] text-[#F97316]">در حال ذخیره...</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
