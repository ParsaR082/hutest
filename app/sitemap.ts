import type { MetadataRoute } from "next";
import { fetchAllMenuSlugs } from "@/lib/api/menu";
import { fetchBlogList } from "@/lib/api/blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://humazd.ir";

const STATIC_ROUTES = [
  "",
  "/about",
  "/menu",
  "/gallery",
  "/blog",
  "/contact",
  "/terms",
  "/privacy",
  // The digital menu's branded welcome screen is real content; its /menu
  // sub-route currently shows static placeholder dish data (not the real
  // menu) and is intentionally excluded here and marked noindex on the
  // page itself -- see app/digital-menu/menu/page.tsx.
  "/digital-menu",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  try {
    const slugs = await fetchAllMenuSlugs();
    for (const slug of slugs) {
      entries.push({ url: `${BASE_URL}/menu/${slug}`, lastModified: new Date() });
    }
  } catch {
    // menu API unavailable at build/request time — skip dynamic entries
  }

  try {
    const posts = await fetchBlogList();
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      });
    }
  } catch {
    // blog API unavailable at build/request time — skip dynamic entries
  }

  return entries;
}
