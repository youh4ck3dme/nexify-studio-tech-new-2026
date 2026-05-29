import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice, type CatalogProduct } from "@/lib/catalog";

type PricingTiersProps = {
  product: CatalogProduct;
  contactHref?: string;
};

export function PricingTiers({
  product,
  contactHref = "/#contact",
}: PricingTiersProps) {
  return (
    <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
      {product.pricing.map((tier, idx) => (
        <div
          key={tier.id}
          className={`relative p-8 lg:p-10 bg-background ${
            tier.isPopular ? "md:-my-4 md:py-12 border-2 border-foreground" : ""
          }`}
        >
          {tier.isPopular && (
            <span className="absolute -top-3 left-8 px-3 py-1 bg-foreground text-primary-foreground text-xs font-mono uppercase tracking-widest">
              Najobľúbenejší
            </span>
          )}

          <div className="mb-6">
            <span className="font-mono text-xs text-muted-foreground">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl text-foreground mt-2">{tier.name}</h3>
            {tier.description && (
              <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            )}
          </div>

          <div className="mb-8 pb-8 border-b border-foreground/10">
            <span className="font-display text-4xl lg:text-5xl text-foreground">
              {formatPrice(tier.price, tier.billingPeriod)}
            </span>
            {tier.billingPeriod === "one-time" && tier.price !== null && (
              <span className="block text-sm text-muted-foreground mt-1">jednorazovo</span>
            )}
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href={contactHref}
            className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group ${
              tier.isPopular
                ? "bg-foreground text-primary-foreground hover:bg-foreground/90"
                : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5"
            }`}
          >
            {tier.ctaText ?? "Kontaktovať nás"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ))}
    </div>
  );
}
