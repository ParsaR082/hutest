import type { Metadata } from "next";
import { AdminSEOPage } from "@/components/admin/AdminSEOPage";

export const metadata: Metadata = {
  title: "سئو | Humazd Admin",
};

export default function AdminSEORoutePage() {
  return <AdminSEOPage />;
}
