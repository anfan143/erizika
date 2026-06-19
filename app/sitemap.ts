import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/blog";

// Generuje /sitemap.xml — zoznam verejných stránok pre vyhľadávače.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.erizika.sk";
  const now = new Date();
  const clanky: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.updated || a.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...clanky,
    { url: `${base}/podmienky`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sukromie`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/odstupenie`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
