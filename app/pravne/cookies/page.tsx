import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { companyLegal, cookiesDocument, legalRoutes } from "@/lib/legal";

export const metadata: Metadata = {
  title: cookiesDocument.title,
  description: cookiesDocument.description,
  alternates: { canonical: `${companyLegal.website}${legalRoutes.cookies}` },
};

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <section className="relative pt-32 lg:pt-40 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <LegalPageLayout document={cookiesDocument} />
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
