import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  formatPrice,
  getCategoryById,
  getLowestPrice,
  type CatalogProduct,
} from "@/lib/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const category = getCategoryById(product.category);
  const lowest = getLowestPrice(product);
  const billingPeriod = product.pricing[0]?.billingPeriod ?? "one-time";
  const popularTier = product.pricing.find((tier) => tier.isPopular);

  return (
    <article className="group border border-foreground/10 bg-background p-6 sm:p-8 flex flex-col h-full red-glow-hover card-lift">
      <div className="mb-6">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red opacity-60 group-hover:opacity-100 transition-opacity" />
          {category?.name}
        </span>
        <h3 className="font-display text-2xl lg:text-3xl text-foreground mt-3 group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {product.shortDescription}
        </p>
      </div>

      <div className="mb-6 pb-6 border-b border-foreground/10">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Od
        </p>
        <p className="font-display text-4xl text-foreground">
          {formatPrice(lowest, billingPeriod)}
        </p>
        {popularTier && (
          <span className="inline-block mt-3 px-3 py-1 badge-red text-xs font-mono uppercase tracking-widest rounded-full">
            {popularTier.name}
          </span>
        )}
      </div>

      <ul className="space-y-2 mb-8 flex-1">
        {product.features.slice(0, 4).map((feature) => (
          <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-red/60" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/produkty/${product.slug}`}
        className="inline-flex items-center justify-center gap-2 w-full py-3.5 border border-foreground/15 text-sm font-medium hover:border-brand-red hover:bg-brand-red hover:text-white transition-all rounded-full group/btn shadow-sm"
      >
        Detail produktu
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </article>
  );
}
