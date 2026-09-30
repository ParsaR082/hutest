import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";

export const metadata: Metadata = {
  title: "ورود مدیریت | Humazd",
  description: "ورود مخصوص کارکنان و مدیران رستوران Humazd.",
  robots: { index: false, follow: false },
};

export default function AdminLoginRoutePage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
