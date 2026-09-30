import type { Metadata } from "next";
import { AdminContactsPage } from "@/components/admin/AdminContactsPage";

export const metadata: Metadata = {
  title: "پیام‌های تماس | Humazd Admin",
};

export default function AdminContactsRoutePage() {
  return <AdminContactsPage />;
}
