import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://humazd.ir";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin-login",
        "/dashboard",
        "/checkout",
        "/auth",
        "/api/",
        "/django-admin/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
