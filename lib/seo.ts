import { fetchPublicSettings } from "@/lib/api/settings";
import { fetchPublicSEO } from "@/lib/api/seo";
import type { Metadata } from "next";
import type { SEOPageKey } from "@/lib/api/types";

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://humazd.ir";

export function resolveAssetUrl(value: string): string {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

/** A real photo already used across the site — used as the default social
 * share image whenever a page has no specific og_image configured, instead
 * of shipping with no image at all. */
const DEFAULT_OG_IMAGE = resolveAssetUrl("/images/hero/background.jpg");

export async function getSiteMetadata(): Promise<Metadata> {
  let title = "رستوران هومزد | سفارش آنلاین غذا در ارومیه";
  let description =
    "رستوران هومزد در ارومیه، خیابان امام رضا ۱ — سفارش آنلاین غذا، رزرو میز و ارسال به سراسر ارومیه.";
  let siteName = "رستوران هومزد";

  try {
    const settings = await fetchPublicSettings();
    const name = settings.restaurant_name || "هومزد";
    siteName = `رستوران ${name}`;
    title = `رستوران ${name} | سفارش آنلاین غذا در ارومیه`;
    description = `رستوران ${name} در ${
      settings.contact_info?.address || "ارومیه"
    } — سفارش آنلاین غذا، رزرو میز و ارسال در سراسر ارومیه.`;
  } catch {
    // use defaults above
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName,
      type: "website",
      locale: "fa_IR",
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/**
 * Builds page Metadata by layering admin-managed SEO overrides (if any exist for
 * this page) on top of a static fallback, so a page never ships with empty SEO
 * tags even before an admin has configured anything for it. `path` (e.g.
 * "/menu") is used to compute the canonical/OG URL when the admin hasn't set
 * an explicit canonical override.
 */
export async function getPageMetadata(
  pageKey: SEOPageKey,
  fallback: { title: string; description: string },
  path = ""
): Promise<Metadata> {
  let seo: Awaited<ReturnType<typeof fetchPublicSEO>> = {};
  try {
    seo = await fetchPublicSEO(pageKey);
  } catch {
    seo = {};
  }

  const title = seo.seo_title || fallback.title;
  const description = seo.meta_description || fallback.description;
  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || description;
  const canonical = seo.canonical_url || `${SITE_URL}${path}`;
  const ogImage = seo.og_image ? resolveAssetUrl(seo.og_image) : DEFAULT_OG_IMAGE;
  const twitterImage = seo.twitter_image ? resolveAssetUrl(seo.twitter_image) : ogImage;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: seo.robots_index ?? true,
      follow: seo.robots_follow ?? true,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: "website",
      locale: "fa_IR",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [twitterImage],
    },
  };
}
