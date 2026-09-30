import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "blog",
    {
      title: "وبلاگ رستوران هومزد | ارومیه",
      description: "یادداشت‌های سرآشپز، پشت صحنه آشپزخانه و داستان‌های رستوران هومزد در ارومیه.",
    },
    "/blog"
  );
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
