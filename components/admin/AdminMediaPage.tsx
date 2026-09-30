"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Search, Trash2, Upload, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { fetchAdminMedia, uploadAdminMedia, updateAdminMedia, deleteAdminMedia, type MediaFile } from "@/lib/api/media";
import { getAccessToken } from "@/lib/auth/storage";
import { ApiError } from "@/lib/api/client";

function formatSize(bytes: number | null) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fa-IR");
}

function DetailPanel({
  file,
  onClose,
  onSaved,
  onDeleted,
}: {
  file: MediaFile;
  onClose: () => void;
  onSaved: (updated: MediaFile) => void;
  onDeleted: (id: number) => void;
}) {
  const [altText, setAltText] = useState(file.alt_text);
  const [description, setDescription] = useState(file.description);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await updateAdminMedia(token, file.id, { alt_text: altText, description });
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (force: boolean) => {
    const token = getAccessToken();
    if (!token) return;
    setDeleting(true);
    try {
      await deleteAdminMedia(token, file.id, force);
      onDeleted(file.id);
    } catch (err) {
      if (err instanceof ApiError && err.code === "IN_USE") {
        setConfirmDelete(true);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-800 p-4">
          <h3 className="truncate font-serif text-base font-semibold text-white" title={file.name}>
            {file.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={file.url} alt={file.alt_text || file.name} className="max-h-64 w-full rounded-xl object-contain bg-black/40" />

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-400 sm:grid-cols-4">
            <div>
              <dt className="text-gray-600">حجم</dt>
              <dd className="mt-0.5 text-gray-300">{formatSize(file.size)}</dd>
            </div>
            <div>
              <dt className="text-gray-600">ابعاد</dt>
              <dd className="mt-0.5 text-gray-300">{file.width && file.height ? `${file.width}×${file.height}` : "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-600">تاریخ آپلود</dt>
              <dd className="mt-0.5 text-gray-300">{formatDate(file.uploaded_at)}</dd>
            </div>
            <div>
              <dt className="text-gray-600">نوع فایل</dt>
              <dd className="mt-0.5 text-gray-300">{file.content_type || "—"}</dd>
            </div>
          </dl>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs text-gray-500">متن جایگزین (Alt Text)</label>
              <input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-800 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">توضیحات</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-gray-800 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F97316]/50"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full bg-[#F97316] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
            </button>
          </div>

          <div className="mt-6 border-t border-gray-800 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">استفاده در</p>
            {file.usage.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">این تصویر در حال حاضر جایی استفاده نمی‌شود.</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {file.usage.map((u, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    {u.location} <span className="text-gray-600">←</span> {u.field}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {confirmDelete ? (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
              <div className="flex items-start gap-2 text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">
                  این تصویر در {file.usage.length} مکان از وب‌سایت استفاده شده و حذف آن باعث خرابی نمایش تصویر در آن بخش‌ها می‌شود. مطمئن هستید؟
                </p>
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleDelete(true)}
                  disabled={deleting}
                  className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {deleting ? "..." : "بله، حذف شود"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-full border border-gray-700 px-4 py-2 text-xs text-gray-300 hover:border-gray-500"
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void handleDelete(false)}
              disabled={deleting}
              className="mt-6 flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? "در حال حذف..." : "حذف تصویر"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async (q?: string) => {
    const token = getAccessToken();
    if (!token) return;
    setFiles(await fetchAdminMedia(token, q));
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(query), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    const token = getAccessToken();
    if (!file || !token) return;
    setUploading(true);
    try {
      await uploadAdminMedia(token, file);
      await load(query);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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
        eyebrow="Media"
        title="کتابخانه رسانه"
        description="تصاویر آپلود‌شده اینجا نمایش داده می‌شوند. برای مشاهده جزئیات، ویرایش متن جایگزین یا محل استفاده هر تصویر، روی آن کلیک کنید."
      >
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600">
          <Upload className="h-4 w-4" />
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void handleUpload(e.target.files)}
          />
        </label>
      </AdminPageHeader>

      <div className="relative mb-6 max-w-sm">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی نام فایل..."
          className="w-full rounded-xl border border-gray-800 bg-[#111111] py-2.5 ps-10 pe-4 text-sm text-white outline-none focus:border-[#F97316]/50"
        />
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500">هنوز فایلی آپلود نشده است.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => setSelected(file)}
              className="group relative overflow-hidden rounded-xl border border-gray-800 bg-[#111111]/80 text-start transition hover:border-[#F97316]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt={file.alt_text || file.name}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="truncate text-xs text-gray-400" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-gray-600">
                  {formatSize(file.size)}
                  {file.width && file.height ? ` · ${file.width}×${file.height}` : ""}
                </p>
                {file.usage.length > 0 && (
                  <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] text-emerald-400">
                    استفاده در {file.usage.length} مکان
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <DetailPanel
          file={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
            setSelected(updated);
          }}
          onDeleted={(id) => {
            setFiles((prev) => prev.filter((f) => f.id !== id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
