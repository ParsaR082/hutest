import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "menu",
    {
      title: "منوی غذا | رستوران هومزد ارومیه",
      description: "مشاهده منوی کامل رستوران هومزد در ارومیه و سفارش آنلاین غذا با ارسال به سراسر شهر.",
    },
    "/menu"
  );
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
