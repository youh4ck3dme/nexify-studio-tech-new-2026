import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/product-card";

export function CatalogPreviewSection() {
  const featured = getFeaturedProducts(4);

  return (
    <section id="produkty" className="relative py-32 lg:py-40 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
              Produkty
            </span>
            <h2 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-6">
              Riešenia pre váš
              <br />
              <span className="text-stroke">digitálny rast</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Vyberte si z našich produktov — od firemných webov cez PWA až po AI
              automatizáciu.
            </p>
          </div>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 text-sm font-medium border border-foreground/20 px-6 py-3 hover:border-foreground hover:bg-foreground/5 transition-colors group"
          >
            Zobraziť celý katalóg
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
