import type { Metadata } from "next";
import { AuthPage } from "@/components/sections/AuthPage";

export const metadata: Metadata = {
  title: "ورود | رستوران Humazd",
  description: "به حساب VIP خود در رستوران Humazd دسترسی داشته باشید.",
  robots: { index: false, follow: false },
};

export default function AuthRoutePage() {
  return <AuthPage />;
}
