import { describe, expect, it } from "vitest";
import {
  allProducts,
  catalogCategories,
  getFeaturedProducts,
  getProductBySlug,
} from "./index";

describe("catalog", () => {
  it("has unique slugs and ids", () => {
    const slugs = allProducts.map((p) => p.slug);
    const ids = allProducts.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each product has required fields and pricing", () => {
    for (const product of allProducts) {
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.shortDescription.length).toBeGreaterThan(0);
      expect(product.features.length).toBeGreaterThan(0);
      expect(product.pricing.length).toBeGreaterThan(0);
      expect(catalogCategories.some((c) => c.id === product.category)).toBe(true);
    }
  });

  it("resolves products by slug", () => {
    expect(getProductBySlug("firemna-webova-stranka")?.name).toBe(
      "Firemná Webová Stránka"
    );
    expect(getProductBySlug("missing-slug")).toBeUndefined();
  });

  it("returns featured products", () => {
    expect(getFeaturedProducts(4).length).toBe(4);
  });
});
