import type { MetadataRoute } from "next";
import { allProducts } from "@/lib/catalog";
import { companyLegal, legalRoutes } from "@/lib/legal/company";
import { serviceSlugs } from "@/lib/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = companyLegal.website;
  const now = new Date();

  const productPages = allProducts.map((product) => ({
    url: `${base}/produkty/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const servicePages = serviceSlugs.map((slug) => ({
    url: `${base}/sluzby/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/produkty`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...productPages,
    ...servicePages,
    { url: `${base}${legalRoutes.privacy}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}${legalRoutes.terms}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}${legalRoutes.cookies}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
