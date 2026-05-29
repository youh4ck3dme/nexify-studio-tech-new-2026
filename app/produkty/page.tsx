import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { parseCatalogCategoryParam } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Produkty",
  description:
    "Produktový katalóg Nexify Studio — weby, e-shopy, PWA, mobilné aplikácie, AI a bezpečnostné služby.",
  openGraph: {
    title: "Produkty | Nexify Studio",
    description:
      "Kompletný katalóg digitálnych produktov a služieb Nexify Studio.",
    url: "https://nexify-studio.tech/produkty",
  },
};

type PageProps = {
  searchParams: Promise<{ kategoria?: string }>;
};

export default async function ProduktyPage({ searchParams }: PageProps) {
  const { kategoria } = await searchParams;
  const initialCategory = parseCatalogCategoryParam(kategoria);

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <section className="relative pt-32 lg:pt-40 pb-24 lg:pb-32 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <CatalogGrid initialCategory={initialCategory} />
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
