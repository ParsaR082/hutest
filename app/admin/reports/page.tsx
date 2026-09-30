import type { Metadata } from "next";
import { AdminReportsPage } from "@/components/admin/AdminReportsPage";

export const metadata: Metadata = {
  title: "گزارش‌ها | Humazd Admin",
};

export default function AdminReportsRoutePage() {
  return <AdminReportsPage />;
}
