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
      "Responzívny dizajn pre mobile aj desktop",
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
    description: "PWA aj natívne riešenia pre iOS a Android s app-like skúsenosťou.",
    category: "mobile-apps",
    highlights: [
      "Progressive Web Apps bez App Store",
      "Natívne aplikácie pre obe platformy",
      "Push notifikácie a offline režim",
      "Integrácia s backend API",
    ],
    faq: [
      {
        q: "PWA alebo natívna appka?",
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
];

export const serviceSlugs = servicePages.map((page) => page.slug);

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
