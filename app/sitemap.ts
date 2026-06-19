import type { MetadataRoute } from "next";

// Generuje /sitemap.xml — zoznam verejných stránok pre vyhľadávače.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.erizika.sk";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/podmienky`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sukromie`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/odstupenie`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
