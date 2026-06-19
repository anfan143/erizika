import type { MetadataRoute } from "next";

// Generuje /robots.txt — povie vyhľadávačom, čo smú indexovať.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // súkromné / aplikačné sekcie do indexu nepatria
      disallow: ["/app", "/auth/"],
    },
    sitemap: "https://www.erizika.sk/sitemap.xml",
    host: "https://www.erizika.sk",
  };
}
