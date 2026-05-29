import Link from "next/link";
import { companyLegal } from "@/lib/legal/company";
import type { LegalDocument } from "@/lib/legal/types";

type LegalPageLayoutProps = {
  document: LegalDocument;
  children?: React.ReactNode;
};

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  return (
    <article className="max-w-3xl">
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Domov
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Právne</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{document.title}</span>
      </nav>

      <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
        Právne dokumenty
      </span>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-6">
        {document.title}
      </h1>
      <p className="text-lg text-muted-foreground mb-12">{document.description}</p>

      <div className="space-y-12">
        {document.sections.map((section) => (
          <section key={section.id} id={section.id} className="border-b border-foreground/10 pb-10">
            <h2 className="font-display text-2xl text-foreground mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside role="complementary" className="mt-16 p-6 border border-foreground/10 bg-foreground/2 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">{companyLegal.legalName}</p>
        <p>{companyLegal.address}</p>
        <p>IČO: {companyLegal.ico} · DIČ: {companyLegal.dic}</p>
        <p>
          <a href={`mailto:${companyLegal.email}`} className="hover:text-foreground transition-colors">
            {companyLegal.email}
          </a>
        </p>
        <p className="font-mono text-xs pt-2">Posledná aktualizácia: {companyLegal.lastUpdated}</p>
      </aside>
    </article>
  );
}
