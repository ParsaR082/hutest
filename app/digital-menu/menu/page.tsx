import type { Metadata } from "next";
import MenuView from "@/components/digital-menu/MenuView";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "منوی دیجیتال | رستوران هومزد",
  description: "مشاهده منوی دیجیتال لوکس رستوران هومزد",
  alternates: { canonical: `${SITE_URL}/digital-menu/menu` },
  // Dish data on this view is still placeholder content (see
  // lib/digitalMenuData.ts), so it's intentionally excluded from search
  // indexing until it's replaced with the real menu.
  robots: { index: false, follow: true },
};

export default function DigitalMenuPage() {
  return <MenuView />;
}
