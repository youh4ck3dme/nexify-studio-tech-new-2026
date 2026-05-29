import type { CatalogCategory, HomepageCategory } from "./types";

export const homepageCategories: HomepageCategory[] = [
  {
    id: "corporate-websites",
    name: "Firemné weby",
    shortLabel: "Weby",
    description: "Profesionálne webové stránky s SEO",
    priceFrom: 1500,
    pricePeriod: "one-time",
    href: "/sluzby/firemne-weby",
    icon: "Globe",
    marqueeRow: 1,
  },
  {
    id: "ecommerce",
    name: "eCommerce",
    shortLabel: "E-shopy",
    description: "Online obchody a payment gateway",
    priceFrom: 3500,
    pricePeriod: "one-time",
    href: "/sluzby/ecommerce",
    icon: "ShoppingCart",
    marqueeRow: 1,
  },
  {
    id: "mobile-apps",
    name: "Mobilné aplikácie",
    shortLabel: "Mobilné",
    description: "PWA a natívne iOS/Android",
    priceFrom: 4000,
    pricePeriod: "one-time",
    href: "/sluzby/mobilne-aplikacie",
    icon: "Smartphone",
    marqueeRow: 1,
  },
  {
    id: "ai-solutions",
    name: "AI riešenia",
    shortLabel: "AI",
    description: "Chatboty a generátor obsahu",
    priceFrom: 49,
    pricePeriod: "monthly",
    href: "/sluzby/ai-riesenia",
    icon: "Bot",
    marqueeRow: 2,
  },
  {
    id: "security",
    name: "Bezpečnosť",
    shortLabel: "Security",
    description: "Penetračné testy a OWASP audit",
    priceFrom: 1500,
    pricePeriod: "one-time",
    href: "/sluzby/bezpecnost",
    icon: "Shield",
    marqueeRow: 2,
  },
  {
    id: "digital-growth",
    name: "SEO balíky",
    shortLabel: "SEO",
    description: "Lokálne SEO, obsah a AI dominancia",
    priceFrom: 250,
    pricePeriod: "monthly",
    href: "/produkty/seo-baliky",
    icon: "TrendingUp",
    marqueeRow: 2,
  },
];

export function getHomepageMarqueeRow(row: 1 | 2): HomepageCategory[] {
  return homepageCategories.filter((category) => category.marqueeRow === row);
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: "web-development",
    name: "Digitálny vývoj a inžinierstvo",
    description: "Weby, e-shopy a komplexné digitálne platformy na mieru.",
  },
  {
    id: "mobile-apps",
    name: "Mobilné aplikácie",
    description: "PWA aj natívne riešenia pre iOS a Android.",
  },
  {
    id: "ai-solutions",
    name: "AI-powered riešenia",
    description: "Chatboty, automatizácia obsahu a inteligentné workflow.",
  },
  {
    id: "security",
    name: "Bezpečnostné služby",
    description: "Penetračné testy, audit a nápravné plány.",
  },
  {
    id: "seo-marketing",
    name: "SEO a digitálny marketing",
    description: "Mesačné SEO balíky, lokálna viditeľnosť a organický rast.",
  },
];
