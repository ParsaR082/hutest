import type { Metadata } from "next";
import { AdminBlogPage } from "@/components/admin/AdminBlogPage";

export const metadata: Metadata = {
  title: "وبلاگ | Humazd Admin",
};

export default function AdminBlogRoutePage() {
  return <AdminBlogPage />;
}
