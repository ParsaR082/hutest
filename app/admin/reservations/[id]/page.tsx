import type { Metadata } from "next";
import { AdminReservationDetailPage } from "@/components/admin/AdminReservationDetailPage";

export const metadata: Metadata = {
  title: "جزئیات رزرو | Humazd Admin",
};

export default function AdminReservationDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminReservationDetailPage params={params} />;
}
