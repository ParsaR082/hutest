import type { Metadata } from "next";
import { ProfileSettingsPage } from "@/components/sections/ProfileSettingsPage";

export const metadata: Metadata = {
  title: "تنظیمات پروفایل | Humazd",
  description: "ویرایش اطلاعات حساب کاربری",
};

export default function DashboardSettingsRoutePage() {
  return <ProfileSettingsPage />;
}
