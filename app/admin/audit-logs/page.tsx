import type { Metadata } from "next";
import { AdminAuditLogsPage } from "@/components/admin/AdminAuditLogsPage";

export const metadata: Metadata = {
  title: "لاگ فعالیت | Humazd Admin",
};

export default function AdminAuditLogsRoutePage() {
  return <AdminAuditLogsPage />;
}
