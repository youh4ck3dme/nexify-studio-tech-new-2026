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
    <article className="group border border-foreground/10 bg-background p-6 sm:p-8 flex flex-col h-full hover:border-foreground/30 card-lift">
      <div className="mb-6">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          {category?.name}
        </span>
        <h3 className="font-display text-2xl lg:text-3xl text-foreground mt-3">
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
          <span className="inline-block mt-3 px-2 py-1 bg-foreground text-primary-foreground text-xs font-mono uppercase tracking-widest">
            {popularTier.name}
          </span>
        )}
      </div>

      <ul className="space-y-2 mb-8 flex-1">
        {product.features.slice(0, 4).map((feature) => (
          <li key={feature} className="text-sm text-muted-foreground">
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/produkty/${product.slug}`}
        className="inline-flex items-center justify-center gap-2 w-full py-3 border border-foreground/20 text-sm font-medium hover:border-foreground hover:bg-foreground/5 transition-colors group/btn"
      >
        Detail produktu
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </article>
  );
}
