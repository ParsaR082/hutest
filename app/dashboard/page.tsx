import type { Metadata } from "next";
import { Dashboard } from "@/components/sections/Dashboard";

export const metadata: Metadata = {
  title: "داشبورد VIP | رستوران Humazd",
  description: "سفارش‌ها، رزروها و امتیازات انحصاری اعضا را مدیریت کنید.",
  robots: { index: false, follow: false },
};

export default function DashboardRoutePage() {
  return <Dashboard />;
}
