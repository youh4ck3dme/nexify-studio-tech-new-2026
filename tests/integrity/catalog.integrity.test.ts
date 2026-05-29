import { describe, expect, it } from "vitest";
import {
  allProducts,
  catalogCategories,
  formatPrice,
  getCategoryById,
  getFeaturedProducts,
  getLowestPrice,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/catalog";

describe("integrity: catalog core", () => {
  it("1/40 has exactly 8 products", () => {
    expect(allProducts).toHaveLength(8);
  });

  it("2/40 has 5 categories", () => {
    expect(catalogCategories).toHaveLength(5);
  });

  it("3/40 all slugs are kebab-case", () => {
    for (const product of allProducts) {
      expect(product.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("4/40 every product resolves by slug", () => {
    for (const product of allProducts) {
      expect(getProductBySlug(product.slug)?.id).toBe(product.id);
    }
  });

  it("5/40 category filters return expected counts", () => {
    expect(getProductsByCategory("web-development")).toHaveLength(2);
    expect(getProductsByCategory("mobile-apps")).toHaveLength(2);
    expect(getProductsByCategory("ai-solutions")).toHaveLength(2);
    expect(getProductsByCategory("security")).toHaveLength(1);
    expect(getProductsByCategory("seo-marketing")).toHaveLength(1);
  });

  it("6/40 featured products count is 4", () => {
    expect(getFeaturedProducts(4)).toHaveLength(4);
  });

  it("7/40 getCategoryById resolves all category ids", () => {
    for (const category of catalogCategories) {
      expect(getCategoryById(category.id)?.name).toBe(category.name);
    }
  });

  it("8/40 formatPrice handles null as Na mieru", () => {
    expect(formatPrice(null)).toBe("Na mieru");
  });

  it("9/40 formatPrice adds monthly suffix", () => {
    expect(formatPrice(299, "monthly")).toContain("/mesiac");
  });

  it("10/40 getLowestPrice returns minimum tier price", () => {
    const product = getProductBySlug("firemna-webova-stranka");
    expect(getLowestPrice(product!)).toBe(1500);
  });

  it("11/40 all products use EUR currency", () => {
    for (const product of allProducts) {
      for (const tier of product.pricing) {
        expect(tier.currency).toBe("EUR");
      }
    }
  });

  it("12/40 each product has at most one popular tier", () => {
    for (const product of allProducts) {
      const popular = product.pricing.filter((tier) => tier.isPopular);
      expect(popular.length).toBeLessThanOrEqual(1);
    }
  });
});
