"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { fetchMe, updateMe } from "@/lib/api/user";
import { getAccessToken, updateStoredUser } from "@/lib/auth/storage";

export function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchMe(token)
      .then((profile) => {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setPhone(profile.phone ?? "");
        setEmail(profile.email);
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
      const updated = await updateMe(token, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });
      updateStoredUser(updated);
      setMessage("پروفایل با موفقیت ذخیره شد.");
    } catch {
      setMessage("ذخیره ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-28 text-white/85 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500 transition hover:text-[#F97316]"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به داشبورد
        </Link>

        <h1 className="font-serif mt-8 text-3xl font-bold text-white">تنظیمات پروفایل</h1>
        <p className="mt-2 text-sm text-gray-500">اطلاعات حساب کاربری خود را ویرایش کنید</p>

        <form onSubmit={(e) => void handleSave(e)} className="mt-10 space-y-5">
          <div>
            <label htmlFor="email" className="text-xs text-gray-500">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111]/50 px-4 py-3 text-sm text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-xs text-gray-500">
                نام
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-xs text-gray-500">
                نام خانوادگی
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="text-xs text-gray-500">
              تلفن
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]/50"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${message.includes("موفق") ? "text-emerald-400" : "text-red-400"}`}
            >
              {message}
            </p>
          )}

          <AnimatedButton type="submit" className="w-full py-3.5 text-xs" disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </AnimatedButton>
        </form>
      </div>
    </div>
  );
}
