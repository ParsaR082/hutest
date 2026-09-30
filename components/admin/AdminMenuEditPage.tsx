"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  createAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminMenuItem,
  updateAdminMenuItem,
} from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

const CATEGORIES = [
  { value: "starters", label: "پیش‌غذا" },
  { value: "mains", label: "اصلی" },
  { value: "desserts", label: "دسر" },
  { value: "drinks", label: "نوشیدنی" },
  { value: "specials", label: "ویژه" },
] as const;

export function AdminMenuEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isCreate = id === "new";
  const itemId = isCreate ? null : Number(id);
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("mains");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [image, setImage] = useState("");
  const [plateImage, setPlateImage] = useState("");
  const [anatomyImage, setAnatomyImage] = useState("");
  const [processImage, setProcessImage] = useState("");
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCreate || itemId === null) return;
    const token = getAccessToken();
    if (!token) return;
    fetchAdminMenuItem(token, itemId)
      .then((item) => {
        setName(String(item.name ?? ""));
        setSlug(String(item.slug ?? ""));
        setCategory(String(item.category ?? "mains"));
        setPrice(String(item.price ?? ""));
        setDescription(String(item.description ?? ""));
        setSortOrder(String(item.sort_order ?? 0));
        setIsAvailable(Boolean(item.is_available ?? true));
        setIsFeatured(Boolean(item.is_featured ?? false));
        setIsBestSeller(Boolean(item.is_best_seller ?? false));
        setImage(String(item.image ?? ""));
        setPlateImage(String(item.plate_image ?? ""));
        setAnatomyImage(String(item.anatomy_image ?? ""));
        setProcessImage(String(item.process_image ?? ""));
      })
      .finally(() => setLoading(false));
  }, [isCreate, itemId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    const payload = {
      name,
      slug,
      category,
      price: Number(price),
      description,
      sort_order: Number(sortOrder) || 0,
      is_available: isAvailable,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      image,
      plate_image: plateImage,
      anatomy_image: anatomyImage,
      process_image: processImage,
    };
    try {
      if (isCreate) {
        const created = await createAdminMenuItem(token, payload);
        router.push(`/admin/menu/${created.id}`);
      } else if (itemId !== null) {
        await updateAdminMenuItem(token, itemId, payload);
        setMessage("ذخیره شد.");
      }
    } catch {
      setMessage("خطا در ذخیره. لطفاً فیلدهای الزامی (نام، اسلاگ، تصویر اصلی، قیمت) را بررسی کنید.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (itemId === null) return;
    if (!window.confirm(`آیا از حذف «${name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`)) return;
    const token = getAccessToken();
    if (!token) return;
    setDeleting(true);
    setMessage(null);
    try {
      await deleteAdminMenuItem(token, itemId);
      router.push("/admin/menu");
    } catch {
      setMessage("خطا در حذف آیتم.");
      setDeleting(false);
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
      <Link
        href="/admin/menu"
        className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-[#F97316]"
      >
        ← بازگشت به منو
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-white">
          {isCreate ? "افزودن غذای جدید" : "ویرایش غذا"}
        </h1>
        {!isCreate && (
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="rounded-xl border border-red-900/60 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-950/40"
          >
            {deleting ? "در حال حذف..." : "حذف این غذا"}
          </button>
        )}
      </div>

      <form onSubmit={(e) => void handleSave(e)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-xs text-gray-500">نام</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Slug (یکتا، لاتین)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="mis-e-torofel"
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">دسته</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">قیمت (تومان)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">ترتیب نمایش</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <MediaPicker
            label="تصویر اصلی *"
            hint="در کارت منو و بشقاب چرخان صفحه غذا نمایش داده می‌شود."
            value={image || null}
            onChange={(media) => setImage(media?.url ?? "")}
          />
          <MediaPicker
            label="تصویر بشقاب"
            hint="در صورت خالی بودن، از تصویر اصلی استفاده می‌شود."
            value={plateImage || null}
            onChange={(media) => setPlateImage(media?.url ?? "")}
          />
          <MediaPicker
            label="تصویر آناتومی غذا"
            hint="پس‌زمینه بخش «آناتومی طعم» در صفحه جزئیات غذا."
            value={anatomyImage || null}
            onChange={(media) => setAnatomyImage(media?.url ?? "")}
          />
          <MediaPicker
            label="تصویر مراحل پخت"
            hint="در بخش «فرآیند پخت» صفحه جزئیات غذا."
            value={processImage || null}
            onChange={(media) => setProcessImage(media?.url ?? "")}
          />
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            موجود (نمایش در سایت)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            ویژه
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
            />
            پرفروش
          </label>
        </div>
        {message && (
          <p className={`text-sm ${message.includes("خطا") ? "text-red-400" : "text-emerald-400"}`}>
            {message}
          </p>
        )}
        <AnimatedButton type="submit" className="px-8 py-3 text-xs" disabled={saving}>
          {saving ? "در حال ذخیره..." : isCreate ? "افزودن غذا" : "ذخیره تغییرات"}
        </AnimatedButton>
      </form>
    </div>
  );
}
