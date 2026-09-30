import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCallbackPage } from "@/components/sections/PaymentCallbackPage";

export const metadata: Metadata = {
  title: "تایید پرداخت | Humazd",
  robots: { index: false, follow: false },
};

export default function PaymentCallbackRoute() {
  return (
    <Suspense fallback={null}>
      <PaymentCallbackPage />
    </Suspense>
  );
}
