import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "gallery",
    {
      title: "گالری تصاویر | رستوران هومزد ارومیه",
      description: "تصاویری از فضای رستوران، غذاها و لحظات رستوران هومزد در ارومیه.",
    },
    "/gallery"
  );
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
