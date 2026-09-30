import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/AdminSettingsPage";

export const metadata: Metadata = {
  title: "تنظیمات | Humazd Admin",
};

export default function AdminSettingsRoutePage() {
  return <AdminSettingsPage />;
}
