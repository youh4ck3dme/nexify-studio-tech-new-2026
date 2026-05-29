import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { companyLegal, legalRoutes, termsDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: termsDocument.title,
  description: termsDocument.description,
  alternates: { canonical: `${companyLegal.website}${legalRoutes.terms}` },
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <section className="relative pt-32 lg:pt-40 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <LegalPageLayout document={termsDocument} />
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
