import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServicePage } from "@/lib/content/services";

type ServiceLandingProps = {
  service: ServicePage;
};

export function ServiceLanding({ service }: ServiceLandingProps) {
  return (
    <article>
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Domov
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{service.title}</span>
      </nav>

      <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
        Služby
      </span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-6">
        {service.title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-12">{service.description}</p>

      <section className="mb-16">
        <h2 className="font-display text-2xl mb-6">Čo získate</h2>
        <ul className="grid md:grid-cols-2 gap-4">
          {service.highlights.map((item) => (
            <li
              key={item}
              className="border border-foreground/10 p-4 text-muted-foreground text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {service.faq.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl mb-6">Časté otázky</h2>
          <div className="space-y-6">
            {service.faq.map((item) => (
              <div key={item.q} className="border-b border-foreground/10 pb-6">
                <h3 className="font-medium text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          href={`/produkty?kategoria=${service.category}`}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors group"
        >
          Produkty v kategórii
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 text-sm font-medium rounded-full hover:border-foreground transition-colors"
        >
          Nezáväzný dopyt
        </Link>
      </div>
    </article>
  );
}
