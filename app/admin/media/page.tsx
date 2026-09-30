import type { Metadata } from "next";
import { AdminMediaPage } from "@/components/admin/AdminMediaPage";

export const metadata: Metadata = {
  title: "رسانه | Humazd Admin",
};

export default function AdminMediaRoutePage() {
  return <AdminMediaPage />;
}
