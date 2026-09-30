"use client";

import { useEffect, useState } from "react";
import { Eye, Plus, Trash2, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  fetchAdminBlogList,
  updateAdminBlogPost,
} from "@/lib/api/blog";
import { getAccessToken } from "@/lib/auth/storage";
import type { BlogPostAdmin } from "@/lib/api/types";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY_FORM = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author_name: "",
  is_published: false,
};

function PostForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: BlogPostAdmin | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleTitleChange = (value: string) => {
    set("title", value);
    if (!slugTouched) set("slug", slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("عنوان، نامک (slug) و متن مطلب الزامی است.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await updateAdminBlogPost(token, initial.id, form);
      } else {
        await createAdminBlogPost(token, form);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره‌سازی.");
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
          {initial ? "ویرایش مطلب" : "نوشتن مطلب جدید"}
        </h2>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500">عنوان</label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">نامک (Slug)</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            dir="ltr"
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">نویسنده</label>
          <input
            value={form.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500">خلاصه</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>

        <div className="sm:col-span-2">
          <MediaPicker
            label="تصویر کاور"
            value={form.cover_image || null}
            onChange={(media) => set("cover_image", media?.url ?? "")}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500">
              متن مطلب (HTML ساده — h2, h3, p, ul, li, blockquote, strong, a, img)
            </label>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#F97316]"
            >
              <Eye className="h-3.5 w-3.5" />
              {preview ? "بازگشت به ویرایش" : "پیش‌نمایش"}
            </button>
          </div>

          {preview ? (
            <div className="prose-humazd mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-gray-800 bg-white p-6">
              <div dangerouslySetInnerHTML={{ __html: form.content || "<p>—</p>" }} />
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={10}
              dir="ltr"
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 font-mono text-xs text-white outline-none focus:border-[#F97316]/50"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-4 w-4 accent-[#F97316]"
            />
            منتشر شده (در وبلاگ عمومی نمایش داده شود)
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

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPostAdmin | null | undefined>(undefined);

  const load = async () => {
    const token = getAccessToken();
    if (!token) return;
    setPosts(await fetchAdminBlogList(token));
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    const token = getAccessToken();
    if (!token) return;
    if (!confirm("این مطلب حذف شود؟")) return;
    await deleteAdminBlogPost(token, id);
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
      <AdminPageHeader eyebrow="Blog" title="مدیریت وبلاگ">
        {editing === undefined && (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            نوشتن مطلب جدید
          </button>
        )}
      </AdminPageHeader>

      {editing !== undefined && (
        <PostForm
          initial={editing}
          onCancel={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            void load();
          }}
        />
      )}

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">هنوز مطلبی نوشته نشده است.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">عنوان</th>
                <th className="px-4 py-3 text-start font-medium">نویسنده</th>
                <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                <th className="px-4 py-3 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">{post.title}</td>
                  <td className="px-4 py-3 text-gray-400">{post.author_name || "—"}</td>
                  <td className="px-4 py-3">
                    {post.is_published ? (
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] text-emerald-400">
                        منتشر شده
                      </span>
                    ) : (
                      <span className="rounded bg-gray-500/10 px-2 py-0.5 text-[0.65rem] text-gray-400">
                        پیش‌نویس
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditing(post)}
                        className="text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-[#F97316]"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(post.id)}
                        aria-label="حذف"
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
