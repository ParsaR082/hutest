import type { Metadata } from "next";
import { AdminTestimonialsPage } from "@/components/admin/AdminTestimonialsPage";

export const metadata: Metadata = {
  title: "نظرات | Humazd Admin",
};

export default function AdminTestimonialsRoutePage() {
  return <AdminTestimonialsPage />;
}
