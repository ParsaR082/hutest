import type { Metadata } from "next";
import { AdminOrdersPage } from "@/components/admin/AdminOrdersPage";

export const metadata: Metadata = {
  title: "مدیریت سفارش‌ها | Humazd Admin",
};

export default function AdminOrdersRoutePage() {
  return <AdminOrdersPage />;
}
