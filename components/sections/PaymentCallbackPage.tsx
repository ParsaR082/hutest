"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { verifyPayment } from "@/lib/api/orders";

export function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"verifying" | "success" | "failed">("verifying");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const authority = searchParams.get("Authority") ?? searchParams.get("authority") ?? "";
    const status = searchParams.get("Status") ?? searchParams.get("status") ?? "";

    if (!authority) {
      setState("failed");
      return;
    }

    verifyPayment(authority, status)
      .then((order) => {
        setState("success");
        setTimeout(() => router.push(`/dashboard?order=${order.id}`), 1500);
      })
      .catch(() => setState("failed"));
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-24 text-white/85">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-[#111111]/90 p-8 text-center">
        {state === "verifying" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#F97316]" />
            <p className="mt-5 text-sm text-gray-400">در حال بررسی نتیجه پرداخت...</p>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="mt-5 text-sm text-gray-300">پرداخت با موفقیت تایید شد.</p>
          </>
        )}
        {state === "failed" && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-red-400" />
            <p className="mt-5 text-sm text-gray-300">پرداخت ناموفق بود یا لغو شد.</p>
          </>
        )}
      </div>
    </div>
  );
}
