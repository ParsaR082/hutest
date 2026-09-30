import type { Metadata } from "next";
import { AdminStaffPage } from "@/components/admin/AdminStaffPage";

export const metadata: Metadata = {
  title: "پرسنل | Humazd Admin",
};

export default function AdminStaffRoutePage() {
  return <AdminStaffPage />;
}
