import type { PublicSettings } from "@/lib/api/types";
import { SITE_URL, resolveAssetUrl } from "@/lib/seo";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function parseOpeningHours(hours: PublicSettings["opening_hours"]) {
  return hours
    .map((entry) => {
      const [opens, closes] = entry.time.split(/[–-]/).map((s) => s.trim());
      if (!opens || !closes) return null;
      const isEveryDay = entry.days.includes("هر روز");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: isEveryDay ? ALL_DAYS : entry.days,
        opens,
        closes,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
}

/** Restaurant/LocalBusiness schema built only from real, admin-configured
 * business data -- no invented ratings, reviews, or prices. */
export function buildRestaurantSchema(settings: PublicSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.restaurant_name || "رستوران هومزد",
    url: SITE_URL,
    telephone: settings.contact_info?.phone,
    email: settings.contact_info?.email || undefined,
    address: settings.contact_info?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.contact_info.address,
          addressLocality: "ارومیه",
          addressCountry: "IR",
        }
      : undefined,
    geo: settings.contact_info?.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: settings.contact_info.coordinates.lat,
          longitude: settings.contact_info.coordinates.lng,
        }
      : undefined,
    image: settings.logo_url ? resolveAssetUrl(settings.logo_url) : undefined,
    servesCuisine: "ایرانی",
    openingHoursSpecification: settings.opening_hours?.length
      ? parseOpeningHours(settings.opening_hours)
      : undefined,
    sameAs: [
      settings.social_instagram,
      settings.social_twitter,
      settings.social_facebook,
      settings.social_youtube,
    ].filter(Boolean),
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "رستوران هومزد",
    url: SITE_URL,
    inLanguage: "fa-IR",
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  published_at: string | null;
}, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image ? resolveAssetUrl(post.cover_image) : undefined,
    author: post.author_name ? { "@type": "Person", name: post.author_name } : undefined,
    datePublished: post.published_at || undefined,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "رستوران هومزد",
      url: SITE_URL,
    },
  };
}
