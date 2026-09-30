import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { AboutContent } from "@/components/sections/AboutContent";
import { fetchPublicSettings } from "@/lib/api/settings";
import { openingHours as fallbackHours } from "@/lib/data";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export default async function AboutPage() {
  let hours = fallbackHours;
  try {
    const settings = await fetchPublicSettings();
    if (settings?.opening_hours?.length) {
      hours = settings.opening_hours;
    }
  } catch {
    // use fallback
  }

  return (
    <>
      <PageStructuredData pageKey="about" />
      <Header />
      <AboutContent hours={hours} />
      <Footer />
    </>
  );
}
