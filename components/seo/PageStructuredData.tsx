import { fetchPublicSEO } from "@/lib/api/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import type { SEOPageKey } from "@/lib/api/types";

/** Renders the admin-editable custom JSON-LD for a page (Admin Panel → سئو
 * → Structured Data), if the admin has set one and it's valid JSON. Silently
 * renders nothing otherwise -- this field was previously stored but never
 * consumed anywhere. */
export async function PageStructuredData({ pageKey }: { pageKey: SEOPageKey }) {
  let raw = "";
  try {
    const seo = await fetchPublicSEO(pageKey);
    raw = seo.structured_data ?? "";
  } catch {
    return null;
  }
  if (!raw.trim()) return null;

  try {
    const data = JSON.parse(raw);
    return <StructuredData data={data} />;
  } catch {
    return null;
  }
}
