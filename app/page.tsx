import type { Metadata } from "next";
import { fetchFeaturedMenu } from "@/lib/api/menu";
import { fetchPublicSettings } from "@/lib/api/settings";
import { mapApiToPopularDish } from "@/lib/mappers/menu";
import { Hero } from "@/components/sections/Hero";
import { SignatureDish } from "@/components/sections/SignatureDish";
import { About } from "@/components/sections/About";
import { PopularDishes } from "@/components/sections/PopularDishes";
import { Footer } from "@/components/sections/Footer";
import { getPageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildRestaurantSchema, buildWebSiteSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home", {
    title: "رستوران هومزد | سفارش آنلاین غذا در ارومیه",
    description: "رستوران هومزد در ارومیه، خیابان امام رضا ۱ — سفارش آنلاین غذا، رزرو میز و ارسال به سراسر ارومیه.",
  });
}

export default async function Home() {
  let featuredDishes: ReturnType<typeof mapApiToPopularDish>[] = [];
  try {
    const items = await fetchFeaturedMenu();
    featuredDishes = items.map(mapApiToPopularDish);
  } catch {
    featuredDishes = [];
  }

  let restaurantSchema: object | null = null;
  try {
    const settings = await fetchPublicSettings();
    restaurantSchema = buildRestaurantSchema(settings);
  } catch {
    restaurantSchema = null;
  }

  return (
    <main
      className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <StructuredData data={[buildWebSiteSchema(), ...(restaurantSchema ? [restaurantSchema] : [])]} />
      <PageStructuredData pageKey="home" />
      <Hero />
      <SignatureDish />
      <PopularDishes dishes={featuredDishes} />
      <About />
      <section className="w-full shrink-0 snap-start snap-always">
        <Footer />
      </section>
    </main>
  );
}
