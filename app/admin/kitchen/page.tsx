import type { Metadata } from "next";
import { AdminKitchenPage } from "@/components/admin/AdminKitchenPage";

export const metadata: Metadata = {
  title: "آشپزخانه (KDS) | Humazd Admin",
};

export default function AdminKitchenRoutePage() {
  return <AdminKitchenPage />;
}
