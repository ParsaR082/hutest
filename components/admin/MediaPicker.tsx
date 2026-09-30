"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Search, Upload, X } from "lucide-react";
import { fetchAdminMedia, uploadAdminMedia, type MediaFile } from "@/lib/api/media";
import { getAccessToken } from "@/lib/auth/storage";

function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (media: MediaFile) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
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
      const media = await uploadAdminMedia(token, file);
      onSelect(media);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-800 p-4">
          <h3 className="font-serif text-base font-semibold text-white">انتخاب تصویر</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-800 p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام فایل..."
              className="w-full rounded-xl border border-gray-800 bg-black/40 py-2.5 ps-10 pe-4 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600">
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "..." : "آپلود جدید"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">در حال بارگذاری...</p>
          ) : files.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">تصویری یافت نشد. یک تصویر جدید آپلود کنید.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onSelect(file)}
                  className="group overflow-hidden rounded-xl border border-gray-800 text-start transition hover:border-[#F97316]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.alt_text || file.name} className="aspect-square w-full object-cover" loading="lazy" />
                  <p className="truncate p-2 text-[0.65rem] text-gray-400" title={file.name}>
                    {file.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaPicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (media: { url: string; id: number } | null) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      {hint && <p className="mt-0.5 text-[0.7rem] text-gray-600">{hint}</p>}
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-black/40">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-gray-700" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-gray-800 px-4 py-2 text-xs font-medium text-gray-300 transition hover:border-[#F97316] hover:text-[#F97316]"
          >
            {value ? "تغییر تصویر" : "انتخاب تصویر"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-[0.7rem] text-gray-600 transition hover:text-red-400"
            >
              حذف تصویر
            </button>
          )}
        </div>
      </div>

      {open && (
        <MediaPickerModal
          onSelect={(media) => {
            onChange({ url: media.url, id: media.id });
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
