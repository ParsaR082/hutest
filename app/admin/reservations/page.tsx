import type { Metadata } from "next";
import { AdminReservationsPage } from "@/components/admin/AdminReservationsPage";

export const metadata: Metadata = {
  title: "مدیریت رزروها | Humazd Admin",
};

export default function AdminReservationsRoutePage() {
  return <AdminReservationsPage />;
}
