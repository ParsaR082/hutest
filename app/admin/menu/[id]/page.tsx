import type { Metadata } from "next";
import { AdminMenuEditPage } from "@/components/admin/AdminMenuEditPage";

export const metadata: Metadata = {
  title: "مدیریت غذا | Humazd Admin",
};

export default function AdminMenuEditRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminMenuEditPage params={params} />;
}
