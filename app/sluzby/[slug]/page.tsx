import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ServiceLanding } from "@/components/services/service-landing";
import { companyLegal } from "@/lib/legal/company";
import { getServiceBySlug, serviceSlugs } from "@/lib/content/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Služba nenájdená" };

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${companyLegal.website}/sluzby/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <section className="relative pt-32 lg:pt-40 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ServiceLanding service={service} />
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
