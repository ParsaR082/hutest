import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { GalleryContent } from "@/components/sections/GalleryContent";
import { fetchGallery } from "@/lib/api/gallery";
import type { GalleryItem } from "@/lib/api/types";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  try {
    items = await fetchGallery();
  } catch {
    items = [];
  }

  return (
    <>
      <PageStructuredData pageKey="gallery" />
      <Header />
      <GalleryContent items={items} />
      <Footer />
    </>
  );
}
