"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/api/auth";
import { saveAuthSession } from "@/lib/auth/storage";

const PHONE_PATTERN = /^09\d{9}$/;

function FloatingInput({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full border-b border-gray-800 bg-transparent py-3.5 text-sm text-white outline-none transition-colors duration-300 placeholder:text-transparent focus:border-[#F97316]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute start-0 top-3.5 origin-[start] text-sm text-gray-500 transition-all duration-300 peer-focus:-top-1 peer-focus:scale-[0.85] peer-focus:text-[#F97316] peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-gray-400"
      >
        {label}
      </label>
    </div>
  );
}

function AuthHeroPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]/40" />
      <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#F97316]">
          فقط برای اعضا
        </p>
        <h2 className="font-serif mt-4 max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">
          میز شما در لانژ VIP منتظر است
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
          سفارش‌های زنده را دنبال کنید، رزروها را مدیریت کنید و تجربه‌های
          اختصاصی سرآشپز را باز کنید — همه در یک داشبورد شیک.
        </p>
      </div>
    </div>
  );
}

export function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "code">("phone");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  function goToDashboard() {
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("/admin") ? next : "/dashboard");
  }

  async function sendOtpCode() {
    setError(null);

    if (!PHONE_PATTERN.test(otpPhone)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید (مثال: 09121234567).");
      return;
    }
    if (otpStep === "phone" && !termsAccepted) {
      setTermsError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await requestOtp(otpPhone);
      setDebugOtp((response as { debug_code?: string }).debug_code ?? null);
      setOtpStep("code");
      setOtpCooldown(60);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setOtpCooldown((c) => {
          if (c <= 1) {
            if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال کد ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    void sendOtpCode();
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await verifyOtp(otpPhone, otpCode);
      saveAuthSession(result.tokens, result.user);
      goToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "کد وارد شده صحیح نیست.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-[#0a0a0a] lg:grid-cols-2">
      <AuthHeroPanel />

      <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16 lg:py-0">
        <div className="mb-10 flex items-center justify-between lg:mb-0 lg:pt-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] text-white">
              <UtensilsCrossed className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="leading-tight">
              <span lang="en" className="font-script block text-2xl text-white">Humazd</span>
              <span className="block text-[0.6rem] font-semibold tracking-[0.28em] text-white/60">
                رستوران
              </span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-8 lg:pb-16">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
              خوش آمدید
            </p>
            <h1 className="font-serif mt-3 text-3xl font-bold text-white sm:text-4xl">
              ورود / ثبت‌نام با موبایل
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              ورود به حساب کاربری هومزد فقط از طریق شماره موبایل و کد یک‌بارمصرف
              پیامکی انجام می‌شود.
            </p>

            <div className="mt-10">
              <motion.form
                key={otpStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-7"
                onSubmit={otpStep === "phone" ? handleOtpRequest : handleOtpVerify}
              >
                <FloatingInput
                  id="otp-phone"
                  label="شماره موبایل (مثال: 09121234567)"
                  type="tel"
                  autoComplete="tel"
                  value={otpPhone}
                  onChange={setOtpPhone}
                />

                {otpStep === "code" && (
                  <>
                    {debugOtp && (
                      <p className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-center text-xs text-yellow-300">
                        کد آزمایشی محیط توسعه: {debugOtp}
                      </p>
                    )}
                    <input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{5}"
                      maxLength={5}
                      autoComplete="one-time-code"
                      placeholder="کد ۵ رقمی ارسال‌شده"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full border-b border-gray-800 bg-transparent py-3.5 text-center text-lg tracking-[0.5em] text-white outline-none transition-colors duration-300 focus:border-[#F97316]"
                    />
                    <button
                      type="button"
                      disabled={otpCooldown > 0 || loading}
                      onClick={() => void sendOtpCode()}
                      className="text-xs text-gray-500 transition hover:text-[#F97316] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {otpCooldown > 0 ? `ارسال مجدد کد (${otpCooldown} ثانیه)` : "ارسال مجدد کد"}
                    </button>
                  </>
                )}

                {otpStep === "phone" && (
                  <div>
                    <label
                      htmlFor="terms-accept"
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        termsError ? "border-red-500/60 bg-red-500/5" : "border-gray-800 bg-[#111111]/60"
                      }`}
                    >
                      <input
                        id="terms-accept"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setTermsError(false);
                        }}
                        aria-required="true"
                        aria-invalid={termsError}
                        aria-describedby={termsError ? "terms-error" : undefined}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-600 accent-[#F97316]"
                      />
                      <span className="text-sm leading-7 text-gray-300">
                        با{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-[#F97316] underline decoration-[#F97316]/40 underline-offset-4 hover:decoration-[#F97316]"
                        >
                          قوانین و مقررات
                        </Link>{" "}
                        و{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-[#F97316] underline decoration-[#F97316]/40 underline-offset-4 hover:decoration-[#F97316]"
                        >
                          حریم خصوصی
                        </Link>{" "}
                        هومزد موافقم.
                      </span>
                    </label>
                    {termsError && (
                      <p id="terms-error" className="mt-2 text-xs text-red-400" role="alert">
                        برای ادامه باید قوانین و مقررات را بپذیرید.
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-[#F97316] py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {loading
                    ? "لطفاً صبر کنید..."
                    : otpStep === "phone"
                      ? "ارسال کد تایید"
                      : "تایید و ورود"}
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
