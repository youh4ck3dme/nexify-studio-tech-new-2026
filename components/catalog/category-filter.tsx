"use client";

import type { CatalogCategoryId } from "@/lib/catalog";
import { catalogCategories } from "@/lib/catalog";

type CategoryFilterProps = {
  active: CatalogCategoryId | "all";
  onChange: (category: CatalogCategoryId | "all") => void;
};

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
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
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
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
