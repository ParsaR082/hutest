"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ApiError } from "@/lib/api/client";
import { verifyPayment } from "@/lib/api/orders";

export function MockPaymentPage({ authority }: { authority: string }) {
  const router = useRouter();
  const [processing, setProcessing] = useState<"pay" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecision = async (decision: "success" | "cancelled") => {
    setProcessing(decision === "success" ? "pay" : "cancel");
    setError(null);
    try {
      const order = await verifyPayment(authority, decision);
      router.push(`/dashboard?order=${order.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "PAYMENT_FAILED"
          ? "پرداخت لغو یا ناموفق بود. می‌توانید دوباره تلاش کنید."
          : "تایید پرداخت با خطا مواجه شد. لطفاً دوباره تلاش کنید."
      );
      setProcessing(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-24 text-white/85">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-[#111111]/90 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10">
          <ShieldCheck className="h-7 w-7 text-[#F97316]" />
        </div>
        <h1 className="mt-5 font-serif text-xl font-bold text-white">درگاه پرداخت آزمایشی</h1>
        <p className="mt-2 text-xs leading-6 text-gray-500">
          این صفحه یک شبیه‌ساز درگاه بانکی (Shaparak) است. برای فعال‌سازی درگاه واقعی، اتصال به
          یک ارائه‌دهنده پرداخت مجاز لازم است.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-black/40 px-4 py-3 text-xs text-gray-400">
          <CreditCard className="h-4 w-4 text-[#F97316]" />
          <span dir="ltr" className="font-mono">
            {authority}
          </span>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 space-y-3">
          <AnimatedButton
            className="w-full py-3.5 text-xs"
            onClick={() => void handleDecision("success")}
            disabled={processing !== null}
          >
            {processing === "pay" ? "در حال تایید..." : "پرداخت موفق (شبیه‌سازی)"}
          </AnimatedButton>
          <button
            type="button"
            onClick={() => void handleDecision("cancelled")}
            disabled={processing !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 py-3.5 text-xs font-medium text-gray-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            {processing === "cancel" ? "در حال لغو..." : "انصراف از پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
}
