import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "about",
    {
      title: "درباره رستوران هومزد | رستوران در ارومیه",
      description: "داستان رستوران هومزد در ارومیه را بشناسید — عشق به آشپزی صادقانه، محصولات فصلی و مهمان‌نوازی گرم.",
    },
    "/about"
  );
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
