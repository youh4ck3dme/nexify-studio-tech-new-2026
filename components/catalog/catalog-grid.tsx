"use client";

import { useEffect, useMemo, useState } from "react";
import { allProducts, type CatalogCategoryId } from "@/lib/catalog";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { CategoryFilter } from "@/components/catalog/category-filter";
import { ProductCard } from "@/components/catalog/product-card";
import { Skeleton } from "@/components/ui/skeleton";

type CatalogGridProps = {
  initialCategory?: CatalogCategoryId | "all";
};

function CatalogSkeleton() {
  return (
    <div
      className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Načítavam katalóg"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border border-foreground/10 p-8 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <span className="sr-only">Načítavam…</span>
    </div>
  );
}

export function CatalogGrid({ initialCategory = "all" }: CatalogGridProps) {
  const [activeCategory, setActiveCategory] = useState<CatalogCategoryId | "all">(
    initialCategory
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: CatalogCategoryId | "all") => {
    setIsLoading(true);
    setActiveCategory(category);
    window.setTimeout(() => setIsLoading(false), 180);
  };

  return (
    <>
      <CatalogHero
        title="Kompletný produktový katalóg"
        description="Digitálny vývoj, mobilné aplikácie, AI riešenia a bezpečnostné služby pre rast vášho biznisu."
      />
      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
      {isLoading ? (
        <CatalogSkeleton />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
