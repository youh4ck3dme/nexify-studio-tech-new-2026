import { seoPackagesData } from "../data/seo-packages";
import type { CatalogProduct } from "../types";

export const seoPackages: CatalogProduct = {
  id: "seo-packages-001",
  name: "SEO balíky",
  slug: "seo-baliky",
  category: "seo-marketing",
  shortDescription:
    "Mesačné SEO balíky od lokálnej dominancie po AI-driven expanziu — technický audit, obsah, linkbuilding a merateľný rast.",
  features: [
    "Technický a rýchlostný audit webu",
    "Google Business Profile a lokálne SEO",
    "On-page optimalizácia a kľúčové slová",
    "Tvorba SEO obsahu a topic clusters",
    "Core Web Vitals a Next.js technické SEO",
    "Linkbuilding a E-E-A-T autorita",
    "Google Analytics 4 a meranie konverzií",
    "Pravidelné reporty a konzultácie",
  ],
  idealFor: seoPackagesData.packages.map((pkg) => pkg.idealFor),
  timeline: "Prvé lokálne výsledky do 30 dní, organický rast 3–6 mesiacov",
  support: "Mesačná správa a reporty podľa balíka",
  faq: [...seoPackagesData.faq],
  pricing: seoPackagesData.packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.title,
    price: pkg.priceEur,
    currency: "EUR" as const,
    billingPeriod: "monthly" as const,
    description: `${pkg.tier} · ${pkg.subtitle}`,
    isPopular: pkg.isHighlighted,
    features: pkg.features,
    ctaText: pkg.ctaText,
  })),
};
