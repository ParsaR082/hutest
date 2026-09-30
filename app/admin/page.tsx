import type { Metadata } from "next";
import { AdminDashboardPage } from "@/components/admin/AdminDashboardPage";

export const metadata: Metadata = {
  title: "پنل مدیریت | Humazd",
  description: "داشبورد تحلیلی و مدیریت رستوران",
};

export default function AdminHomePage() {
  return <AdminDashboardPage />;
}
