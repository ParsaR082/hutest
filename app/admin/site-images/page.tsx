import type { Metadata } from "next";
import { AdminSiteImagesPage } from "@/components/admin/AdminSiteImagesPage";

export const metadata: Metadata = {
  title: "تصاویر سایت | Humazd Admin",
};

export default function AdminSiteImagesRoutePage() {
  return <AdminSiteImagesPage />;
}
