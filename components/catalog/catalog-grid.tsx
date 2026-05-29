"use client";

import { useEffect, useMemo, useState } from "react";
import { allProducts, type CatalogCategoryId } from "@/lib/catalog";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { CategoryFilter } from "@/components/catalog/category-filter";
import { ProductCard } from "@/components/catalog/product-card";

type CatalogGridProps = {
  initialCategory?: CatalogCategoryId | "all";
};

export function CatalogGrid({ initialCategory = "all" }: CatalogGridProps) {
  const [activeCategory, setActiveCategory] = useState<CatalogCategoryId | "all">(
    initialCategory
  );

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <CatalogHero
        title="Kompletný produktový katalóg"
        description="Digitálny vývoj, mobilné aplikácie, AI riešenia a bezpečnostné služby pre rast vášho biznisu."
      />
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
