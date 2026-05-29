import type { CatalogCategoryId } from "@/lib/catalog/types";

export type ServicePage = {
  slug: string;
  title: string;
  description: string;
  category: CatalogCategoryId;
  highlights: string[];
  faq: Array<{ q: string; a: string }>;
};

export const servicePages: ServicePage[] = [
  {
    slug: "firemne-weby",
    title: "Firemné weby",
    description:
      "Profesionálne firemné webové stránky s moderným dizajnom, rýchlym načítaním a SEO optimalizáciou.",
    category: "web-development",
    highlights: [
      "Responzívny dizajn pre mobily aj desktop",
      "SEO a Core Web Vitals optimalizácia",
      "Kontaktný formulár a integrácie",
      "Statická generácia cez Next.js pre rýchlosť",
    ],
    faq: [
      {
        q: "Koľko trvá vytvorenie webu?",
        a: "Typicky 3–4 týždne podľa rozsahu a počtu revízií.",
      },
      {
        q: "Od akej ceny?",
        a: "Orientačne od €1 500 podľa balíka v katalógu.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "eCommerce",
    description:
      "Komplexné online obchody s platobnou bránou, skladom a administráciou objednávok.",
    category: "web-development",
    highlights: [
      "Stripe, PayPal, GoPay integrácie",
      "Správa produktov a skladu",
      "Responzívny checkout",
      "Analytika konverzií",
    ],
    faq: [
      {
        q: "Podporujete existujúce e-shopy?",
        a: "Áno, vieme migrovať alebo rozšíriť existujúcu platformu.",
      },
    ],
  },
  {
    slug: "mobilne-aplikacie",
    title: "Mobilné aplikácie",
    description: "PWA aj natívne riešenia pre iOS a Android so skúsenosťou podobnou natívnej aplikácii.",
    category: "mobile-apps",
    highlights: [
      "Progressive Web Apps bez App Store",
      "Natívne aplikácie pre obe platformy",
      "Push notifikácie a offline režim",
      "Integrácia s backend API",
    ],
    faq: [
      {
        q: "PWA alebo natívna aplikácia?",
        a: "PWA pre rýchle spustenie a nižšiu cenu, natívna app pre plný prístup k zariadeniu.",
      },
    ],
  },
  {
    slug: "ai-riesenia",
    title: "AI riešenia",
    description: "Chatboty, generovanie obsahu a automatizácia workflow pre váš biznis.",
    category: "ai-solutions",
    highlights: [
      "AI chatbot pre customer support",
      "Generátor marketingového obsahu",
      "Integrácia GPT / Claude modelov",
      "Tréning na vašich dátach",
    ],
    faq: [
      {
        q: "Je AI riešenie mesačné?",
        a: "Niektoré produkty majú mesačný model od €49/mesiac podľa katalógu.",
      },
    ],
  },
  {
    slug: "bezpecnost",
    title: "Bezpečnostné audity",
    description: "Penetračné testovanie, OWASP audit a nápravné plány pre vaše systémy.",
    category: "security",
    highlights: [
      "OWASP Top 10 testovanie",
      "Detailný technický report",
      "Plán nápravy zraniteľností",
      "Re-test po opravách",
    ],
    faq: [
      {
        q: "Pre koho je audit vhodný?",
        a: "Pre weby, interné nástroje a aplikácie spracúvajúce citlivé údaje.",
      },
    ],
  },
  {
    slug: "seo",
    title: "SEO balíky",
    description:
      "Mesačné SEO balíky od lokálnej dominancie po AI-driven expanziu — audit, obsah, linkbuilding a reporty.",
    category: "seo-marketing",
    highlights: [
      "Local Authority Kit od €250/mesiac",
      "Growth Engine s obsahom a linkbuildingom",
      "AI SEO Dominance pre trhových lídrov",
      "Google Mapy, GA4 a Core Web Vitals",
    ],
    faq: [
      {
        q: "Prečo je potrebná mesačná platba za SEO?",
        a: "SEO je kontinuálny proces — algoritmy sa menia, konkurencia rastie a autorita domény sa buduje pravidelnou prácou.",
      },
      {
        q: "Kedy uvidím prvé výsledky?",
        a: "Lokálne SEO často do 30 dní, organický rast zvyčajne medzi 3. a 6. mesiacom aktívnej správy.",
      },
    ],
  },
];

export const serviceSlugs = servicePages.map((page) => page.slug);

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
