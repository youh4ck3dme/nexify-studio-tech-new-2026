import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Globe,
  Shield,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { formatPrice, type HomepageCategory } from "@/lib/catalog";

const iconMap: Record<HomepageCategory["icon"], LucideIcon> = {
  Globe,
  ShoppingCart,
  Smartphone,
  Bot,
  Shield,
  TrendingUp,
};

type CategoryCardProps = {
  category: HomepageCategory;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = iconMap[category.icon];

  return (
    <Link
      href={category.href}
      aria-label={`Kategória: ${category.name}`}
      className="group shrink-0 min-w-[280px] md:min-w-[320px] h-[280px] border border-foreground/10 bg-background p-8 flex flex-col justify-between hover:border-foreground/30 hover:bg-foreground/2sition-all duration-300 hover:-translate-y-1"
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <span className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <h3 className="font-display text-2xl text-foreground mb-2">{category.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="flex items-end justify-between pt-6 border-t border-foreground/10">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Od
          </p>
          <p className="font-display text-3xl text-foreground">
            {formatPrice(category.priceFrom, category.pricePeriod)}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
