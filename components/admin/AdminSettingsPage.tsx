"use client";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111111]/60 p-6">
      <h2 className="font-serif text-base font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ElementType }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative mt-1.5">
        {Icon && (
          <Icon className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
        )}
        <input
          {...props}
          className={`w-full rounded-xl border border-gray-800 bg-[#111111] py-3 text-sm text-white outline-none focus:border-[#F97316]/50 ${
            Icon ? "ps-10 pe-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminSettings(token)
      .then((s) => {
        setRestaurantName(s.restaurant_name ?? "");
        setLogoUrl(s.logo_url ?? "");
        setPhone(s.contact_info?.phone ?? "");
        setEmail(s.contact_info?.email ?? "");
        setAddress(s.contact_info?.address ?? "");
        setInstagram(s.social_instagram ?? "");
        setTwitter(s.social_twitter ?? "");
        setFacebook(s.social_facebook ?? "");
        setYoutube(s.social_youtube ?? "");
        setDeliveryFee(String(s.delivery_fee ?? 0));
        setFreeDeliveryThreshold(String(s.free_delivery_threshold ?? 0));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateAdminSettings(token, {
        restaurant_name: restaurantName,
        logo_url: logoUrl,
        phone,
        email,
        address,
        social_instagram: instagram,
        social_twitter: twitter,
        social_facebook: facebook,
        social_youtube: youtube,
        delivery_fee: Number(deliveryFee) || 0,
        free_delivery_threshold: Number(freeDeliveryThreshold) || 0,
      });
      setMessage("تنظیمات ذخیره شد.");
    } catch {
      setMessage("خطا در ذخیره.");
    } finally {
      setSaving(false);
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
        eyebrow="Settings"
        title="تنظیمات رستوران"
        description="این اطلاعات مستقیماً روی وب‌سایت عمومی (سربرگ، فوتر و صفحه تماس) نمایش داده می‌شود."
      />

      <form onSubmit={(e) => void handleSave(e)} className="max-w-xl space-y-6">
        <FieldGroup title="اطلاعات پایه">
          <Field
            label="نام رستوران"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
          <MediaPicker
            label="آرم (لوگو) سایت"
            hint="خالی بگذارید تا آرم پیش‌فرض متنی نمایش داده شود."
            value={logoUrl || null}
            onChange={(media) => setLogoUrl(media?.url ?? "")}
          />
          <Field label="تلفن" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Field
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="text-xs text-gray-500">آدرس</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
        </FieldGroup>

        <FieldGroup title="هزینه ارسال">
          <Field
            label="هزینه ارسال ثابت (تومان)"
            type="number"
            min={0}
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
          />
          <div>
            <label className="text-xs text-gray-500">آستانه ارسال رایگان (تومان)</label>
            <p className="mt-0.5 text-[0.7rem] text-gray-600">
              اگر جمع سفارش مساوی یا بیشتر از این مبلغ باشد، ارسال رایگان می‌شود. صفر یعنی غیرفعال.
            </p>
            <input
              type="number"
              min={0}
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>
        </FieldGroup>

        <FieldGroup title="شبکه‌های اجتماعی">
          <Field
            label="اینستاگرام"
            icon={Link2}
            placeholder="https://instagram.com/..."
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <Field
            label="توییتر / X"
            icon={Link2}
            placeholder="https://x.com/..."
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          <Field
            label="فیسبوک"
            icon={Link2}
            placeholder="https://facebook.com/..."
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
          <Field
            label="یوتیوب"
            icon={Link2}
            placeholder="https://youtube.com/..."
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </FieldGroup>

        {message && (
          <p className={`text-sm ${message.includes("خطا") ? "text-red-400" : "text-emerald-400"}`}>
            {message}
          </p>
        )}
        <AnimatedButton type="submit" className="px-8 py-3 text-xs" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </AnimatedButton>
      </form>
    </div>
  );
}
