import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account pages and the API have nothing a search engine should index.
      disallow: ["/api/", "/dashboard", "/add-studio", "/my-listings", "/my-bookings", "/saved", "/studios/edit/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
