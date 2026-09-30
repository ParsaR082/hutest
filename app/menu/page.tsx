import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { TimelineMenu } from "@/components/sections/TimelineMenu";
import { fetchMenuItems } from "@/lib/api/menu";
import { mapApiToTimelineItem } from "@/lib/mappers/menu";
import type { TimelineMenuItem } from "@/lib/menu-timeline-data";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export default async function MenuPage() {
  let items: TimelineMenuItem[] = [];
  try {
    const apiItems = await fetchMenuItems();
    items = apiItems.map(mapApiToTimelineItem);
  } catch {
    items = [];
  }

  return (
    <>
      <PageStructuredData pageKey="menu" />
      <Header />
      <main className="bg-[#111111]">
        <ParallaxHero />
        <TimelineMenu items={items} />
      </main>
      <Footer />
    </>
  );
}
