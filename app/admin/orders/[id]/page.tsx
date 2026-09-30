import type { Metadata } from "next";
import { AdminOrderDetailPage } from "@/components/admin/AdminOrderDetailPage";

export const metadata: Metadata = {
  title: "جزئیات سفارش | Humazd Admin",
};

export default function AdminOrderDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminOrderDetailPage params={params} />;
}
