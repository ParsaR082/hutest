import type { Metadata } from "next";
import { AdminCustomersPage } from "@/components/admin/AdminCustomersPage";

export const metadata: Metadata = {
  title: "مشتریان | Humazd Admin",
};

export default function AdminCustomersRoutePage() {
  return <AdminCustomersPage />;
}
