import type { Metadata } from "next";
import { AdminMenuPage } from "@/components/admin/AdminMenuPage";

export const metadata: Metadata = {
  title: "مدیریت منو | Humazd Admin",
};

export default function AdminMenuRoutePage() {
  return <AdminMenuPage />;
}
