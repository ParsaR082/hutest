"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { login } from "@/lib/api/auth";
import { saveAuthSession } from "@/lib/auth/storage";
import { isStaffRole } from "@/lib/auth/roles";

export function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(username, password);
      if (!result.user || !isStaffRole(result.user.role)) {
        setError("این حساب دسترسی به پنل مدیریت را ندارد.");
        return;
      }
      saveAuthSession(result.tokens, result.user);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود. اطلاعات را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F97316]/25 bg-[#F97316]/10 text-[#F97316]">
            <ShieldCheck className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <h1 className="font-serif mt-5 text-2xl font-bold text-white">
            پنل مدیریت Humazd
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
            این بخش مخصوص کارکنان و مدیران رستوران است. برای دسترسی به حساب
            کاربری خود از صفحه ورود مشتریان استفاده کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/50"
              >
                نام کاربری
              </label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/50"
              >
                رمز عبور
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#F97316] py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "در حال بررسی..." : "ورود به پنل مدیریت"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
