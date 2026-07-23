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
        className={`shrink-0 min-h-[44px] px-5 py-2 text-sm rounded-full border transition-all btn-micro ${
          active === "all"
            ? "bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20 font-medium"
            : "border-foreground/15 text-muted-foreground hover:border-brand-red/50 hover:text-foreground"
        }`}
      >
        Všetko
      </button>
      {catalogCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`shrink-0 min-h-[44px] px-5 py-2 text-sm rounded-full border transition-all btn-micro ${
            active === category.id
              ? "bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20 font-medium"
              : "border-foreground/15 text-muted-foreground hover:border-brand-red/50 hover:text-foreground"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
