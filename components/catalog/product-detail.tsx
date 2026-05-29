import Link from "next/link";
import { Check } from "lucide-react";
import { getCategoryById, type CatalogProduct } from "@/lib/catalog";
import { PricingTiers } from "./pricing-tiers";

type ProductDetailProps = {
  product: CatalogProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const category = getCategoryById(product.category);

  return (
    <div>
      <nav className="mb-10 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Domov
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produkty" className="hover:text-foreground transition-colors">
          Produkty
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="max-w-3xl mb-16">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-4">
          {category?.name}
        </span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-6">
          {product.name}
        </h1>
        <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="font-display text-2xl mb-6">Čo získate</h2>
          <ul className="space-y-3">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-foreground mt-1 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          {product.idealFor && (
            <div>
              <h2 className="font-display text-2xl mb-4">Ideálne pre</h2>
              <ul className="space-y-2">
                {product.idealFor.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.aiModels && (
            <div>
              <h2 className="font-display text-2xl mb-4">AI modely</h2>
              <ul className="space-y-2">
                {product.aiModels.map((model) => (
                  <li key={model} className="text-muted-foreground">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.contentTypes && (
            <div>
              <h2 className="font-display text-2xl mb-4">Typy obsahu</h2>
              <ul className="space-y-2">
                {product.contentTypes.map((type) => (
                  <li key={type} className="text-muted-foreground">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.deliverables && (
            <div>
              <h2 className="font-display text-2xl mb-4">Výstupy projektu</h2>
              <ul className="space-y-2">
                {product.deliverables.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.technicalDetails && (
            <div>
              <h2 className="font-display text-2xl mb-4">Technológie</h2>
              <div className="space-y-4">
                {Object.entries(product.technicalDetails).map(([key, values]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-foreground mb-2">{key}</p>
                    <p className="text-sm text-muted-foreground">{values.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(product.timeline || product.support || product.owasp) && (
            <div className="border border-foreground/10 p-6 space-y-3">
              {product.timeline && (
                <p className="text-sm">
                  <span className="text-foreground font-medium">Čas realizácie: </span>
                  <span className="text-muted-foreground">{product.timeline}</span>
                </p>
              )}
              {product.support && (
                <p className="text-sm">
                  <span className="text-foreground font-medium">Podpora: </span>
                  <span className="text-muted-foreground">{product.support}</span>
                </p>
              )}
              {product.owasp && (
                <p className="text-sm">
                  <span className="text-foreground font-medium">Metodológia: </span>
                  <span className="text-muted-foreground">{product.owasp}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="font-display text-3xl md:text-4xl mb-10">Balíky a ceny</h2>
        <PricingTiers product={product} />
      </div>

      {product.faq && product.faq.length > 0 && (
        <div className="border-t border-foreground/10 pt-16">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Často kladené otázky</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {product.faq.map((item) => (
              <div key={item.q} className="space-y-3">
                <h3 className="font-display text-xl text-foreground">{item.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
