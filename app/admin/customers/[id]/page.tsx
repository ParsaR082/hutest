import type { Metadata } from "next";
import { AdminCustomerDetailPage } from "@/components/admin/AdminCustomerDetailPage";

export const metadata: Metadata = {
  title: "پروفایل مشتری | Humazd Admin",
};

export default function AdminCustomerDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminCustomerDetailPage params={params} />;
}
