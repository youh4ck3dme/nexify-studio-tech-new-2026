export type SeoPackageDefinition = {
  id: string;
  tier: string;
  title: string;
  subtitle: string;
  idealFor: string;
  priceEur: number;
  billingCycle: "mesačne";
  isHighlighted: boolean;
  features: string[];
  ctaText: string;
};

export const seoPackagesData = {
  packages: [
    {
      id: "pkg-local-authority",
      tier: "Základný",
      title: "Local Authority Kit",
      subtitle: "Ovládnite svoje mesto a región.",
      idealFor: "Živnostníci, remeselníci, lokálne prevádzky a menšie školy.",
      priceEur: 250,
      billingCycle: "mesačne",
      isHighlighted: false,
      features: [
        "Kompletný technický a rýchlostný audit webu",
        "Google Business Profile (Mapy) – plná optimalizácia a správa",
        "On-page SEO pre 5 kľúčových podstránok",
        "Analýza a nasadenie 15–20 lokálnych kľúčových slov",
        "Základné nastavenie Google Analytics 4 a merania konverzií",
        "Kvartálny report pozícií vo vyhľadávaní",
      ],
      ctaText: "Získať lokálnu dominanciu",
    },
    {
      id: "pkg-growth-engine",
      tier: "Biznis",
      title: "Growth Engine & Content",
      subtitle: "Stroj na generovanie organických dopytov a prihlášok.",
      idealFor: "B2B firmy, stredné podniky, e-shopy a univerzity.",
      priceEur: 550,
      billingCycle: "mesačne",
      isHighlighted: true,
      features: [
        "Všetko z balíka Local Authority Kit",
        "Tvorba dlhodobej SEO stratégie (Topic Clusters)",
        "4× prémiový SEO obsah mesačne (optimalizovaný pre vyhľadávací intent)",
        "Optimalizácia Core Web Vitals pre maximálnu rýchlosť načítania",
        "Budovanie autority (linkbuilding – 2 kvalitné spätné odkazy/mesiac)",
        "Optimalizácia E-E-A-T (skúsenosti, odbornosť, autorita, dôveryhodnosť)",
        "Mesačný videoreport a konzultácia výsledkov",
      ],
      ctaText: "Spustiť organický rast",
    },
    {
      id: "pkg-ai-dominance",
      tier: "Prémiový",
      title: "AI SEO Dominance",
      subtitle: "Agresívne obsadenie trhu a bezkonkurenčná E-E-A-T autorita.",
      idealFor: "Trhoví lídri, inštitúcie, SaaS projekty a expanzia na nové trhy.",
      priceEur: 1200,
      billingCycle: "mesačne",
      isHighlighted: false,
      features: [
        "Všetko z balíka Growth Engine",
        "Programatické SEO (generovanie stoviek cielených podstránok vďaka AI)",
        "Hĺbkové technické SEO na úrovni kódu (Next.js / SSR optimalizácie)",
        "Prémiový linkbuilding (PR články na silných autoritatívnych doménach)",
        "Scraping konkurencie a automatizovaná identifikácia medzier na trhu",
        "A/B testovanie meta tagov a nadpisov v reálnom čase",
        "Priamy prístup k hlavnému SEO architektovi (prioritná podpora)",
      ],
      ctaText: "Ovládnuť trh",
    },
  ] satisfies SeoPackageDefinition[],
  faq: [
    {
      q: "Prečo je potrebná mesačná platba za SEO?",
      a: "SEO nie je jednorazové nastavenie, ale kontinuálny proces. Algoritmy Googlu sa menia, konkurencia nespí a na získanie a udržanie popredných pozícií je nutné pravidelne tvoriť obsah a budovať autoritu domény.",
    },
    {
      q: "Kedy uvidím prvé výsledky?",
      a: "Pri lokálnom SEO (Google Mapy) sú zmeny viditeľné často do 30 dní. Pri organickom raste a budovaní obsahu sa prvé merateľné výsledky a nárast dopytov dostavujú medzi 3. až 6. mesiacom aktívnej správy.",
    },
  ],
} as const;
