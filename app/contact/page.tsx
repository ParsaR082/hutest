import { fetchPublicSettings } from "@/lib/api/settings";
import { ContactPage } from "@/components/sections/ContactPage";
import type { PublicSettings } from "@/lib/api/types";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export default async function ContactRoutePage() {
  let settings: PublicSettings | null = null;
  try {
    settings = await fetchPublicSettings();
  } catch {
    settings = null;
  }

  return (
    <>
      <PageStructuredData pageKey="contact" />
      <ContactPage settings={settings} />
    </>
  );
}
