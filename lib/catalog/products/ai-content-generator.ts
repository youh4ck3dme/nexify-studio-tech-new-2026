import type { CatalogProduct } from "../types";

export const aiContentGenerator: CatalogProduct = {
  id: "ai-content-001",
  name: "AI generátor obsahu",
  slug: "ai-generator-obsahu",
  category: "ai-solutions",
  shortDescription:
    "Automatizované generovanie optimalizovaného obsahu pre marketing",
  contentTypes: [
    "Blog články (500-2000 slov)",
    "Popisy produktov",
    "Príspevky na sociálne siete",
    "Email kampane",
    "Copywriting pre reklamy",
    "Landing page obsah",
    "Video scenáre",
    "Podcast outline",
  ],
  features: [
    "Blog články",
    "Sociálne médiá",
    "Email copywriting",
    "SEO optimalizácia",
    "Multi-jazykový obsah",
    "Prispôsobenie tónu",
    "Plagiátizmus check",
    "Plánovač obsahu",
    "Tímová kolaborácia",
  ],
  pricing: [
    {
      id: "basic",
      name: "Základný",
      price: 49,
      currency: "EUR",
      billingPeriod: "monthly",
      features: ["50 článkov/mesiac", "Základný AI", "5 jazykov"],
    },
    {
      id: "pro",
      name: "Profesionál",
      price: 149,
      currency: "EUR",
      billingPeriod: "monthly",
      isPopular: true,
      features: ["200 článkov", "GPT-4", "15 jazykov", "SEO optimalizácia"],
    },
  ],
};
