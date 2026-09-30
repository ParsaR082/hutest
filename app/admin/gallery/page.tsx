import type { Metadata } from "next";
import { AdminGalleryPage } from "@/components/admin/AdminGalleryPage";

export const metadata: Metadata = {
  title: "گالری | Humazd Admin",
};

export default function AdminGalleryRoutePage() {
  return <AdminGalleryPage />;
}
