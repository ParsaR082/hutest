import type { Metadata } from "next";
import { CheckoutPage } from "@/components/sections/CheckoutPage";

export const metadata: Metadata = {
  title: "تکمیل سفارش | Humazd",
  description: "ثبت و تکمیل سفارش غذا",
  robots: { index: false, follow: false },
};

export default function CheckoutRoutePage() {
  return <CheckoutPage />;
}
