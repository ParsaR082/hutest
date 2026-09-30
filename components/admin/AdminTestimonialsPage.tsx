"use client";

import { useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createAdminTestimonial, fetchAdminTestimonials } from "@/lib/api/admin";
import type { AdminTestimonial } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    const token = getAccessToken();
    if (!token) return Promise.resolve();
    return fetchAdminTestimonials(token).then(setItems);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    try {
      await createAdminTestimonial(token, {
        name,
        role,
        content,
        avatar,
        rating: 5,
      });
      setName("");
      setRole("");
      setContent("");
      setAvatar("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="CMS" title="نظرات مشتریان" />

      <form
        onSubmit={(e) => void handleCreate(e)}
        className="mb-8 max-w-2xl space-y-3 rounded-2xl border border-gray-800 bg-[#111111]/80 p-5"
      >
        <input
          placeholder="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
        />
        <input
          placeholder="نقش / عنوان"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
        />
        <textarea
          placeholder="متن نظر"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
        />
        <MediaPicker label="آواتار" value={avatar || null} onChange={(media) => setAvatar(media?.url ?? "")} />
        <AnimatedButton type="submit" className="px-5 py-2.5 text-[0.65rem]" disabled={saving}>
          {saving ? "..." : "افزودن نظر"}
        </AnimatedButton>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-4">
          {items.map((t) => (
            <blockquote
              key={t.id}
              className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-5"
            >
              <p className="text-sm leading-relaxed text-gray-300">{t.content}</p>
              <footer className="mt-3 text-xs text-gray-500">
                {t.name} · {t.role}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
