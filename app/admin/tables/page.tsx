import type { Metadata } from "next";
import { AdminTablesPage } from "@/components/admin/AdminTablesPage";

export const metadata: Metadata = {
  title: "میزها | Humazd Admin",
};

export default function AdminTablesRoutePage() {
  return <AdminTablesPage />;
}
