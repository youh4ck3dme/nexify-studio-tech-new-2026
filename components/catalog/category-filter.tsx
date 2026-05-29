"use client";

import type { CatalogCategoryId } from "@/lib/catalog";
import { catalogCategories } from "@/lib/catalog";

type CategoryFilterProps = {
  active: CatalogCategoryId | "all";
  onChange: (category: CatalogCategoryId | "all") => void;
};

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 mb-12 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`shrink-0 min-h-[44px] px-4 py-2 text-sm rounded-full border transition-colors btn-micro ${
          active === "all"
            ? "bg-foreground text-primary-foreground border-foreground"
            : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground"
        }`}
      >
        Všetko
      </button>
      {catalogCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`shrink-0 min-h-[44px] px-4 py-2 text-sm rounded-full border transition-colors btn-micro ${
            active === category.id
              ? "bg-foreground text-primary-foreground border-foreground"
              : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
