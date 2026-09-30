import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "contact",
    {
      title: "تماس با ما | رستوران هومزد ارومیه",
      description: "راه‌های تماس، آدرس (ارومیه، خیابان امام رضا ۱) و ساعات کاری رستوران هومزد.",
    },
    "/contact"
  );
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
