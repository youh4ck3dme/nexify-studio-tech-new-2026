import { catalogCategories, getHomepageMarqueeRow, homepageCategories } from "./categories";
import { aiChatbot } from "./products/ai-chatbot";
import { aiContentGenerator } from "./products/ai-content-generator";
import { corporateWebsite } from "./products/corporate-website";
import { ecommercePlatform } from "./products/ecommerce-platform";
import { nativeMobileApp } from "./products/native-mobile-app";
import { penetrationTesting } from "./products/penetration-testing";
import { pwaProduct } from "./products/pwa-product";
import type { CatalogCategoryId, CatalogProduct } from "./types";

export const allProducts: CatalogProduct[] = [
  corporateWebsite,
  ecommercePlatform,
  pwaProduct,
  nativeMobileApp,
  aiChatbot,
  aiContentGenerator,
  penetrationTesting,
];

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return allProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: CatalogCategoryId): CatalogProduct[] {
  return allProducts.filter((product) => product.category === category);
}

export function getFeaturedProducts(limit = 4): CatalogProduct[] {
  const featured = allProducts.filter((product) => product.featured);
  return featured.slice(0, limit);
}

export function getCategoryById(id: CatalogCategoryId) {
  return catalogCategories.find((category) => category.id === id);
}

export function getLowestPrice(product: CatalogProduct): number | null {
  const prices = product.pricing
    .map((tier) => tier.price)
    .filter((price): price is number => price !== null);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export function formatPrice(
  price: number | null,
  billingPeriod: "one-time" | "monthly" = "one-time"
): string {
  if (price === null) return "Na mieru";
  const suffix = billingPeriod === "monthly" ? "/mesiac" : "";
  return `€${price.toLocaleString("sk-SK")}${suffix}`;
}

export {
  catalogCategories,
  getHomepageMarqueeRow,
  homepageCategories,
};
export type {
  CatalogCategoryId,
  CatalogProduct,
  HomepageCategory,
  PricingTier,
} from "./types";

const VALID_CATEGORY_IDS = new Set<CatalogCategoryId>([
  "web-development",
  "mobile-apps",
  "ai-solutions",
  "security",
]);

export function parseCatalogCategoryParam(
  value: string | undefined
): CatalogCategoryId | "all" {
  if (!value || !VALID_CATEGORY_IDS.has(value as CatalogCategoryId)) {
    return "all";
  }
  return value as CatalogCategoryId;
}
