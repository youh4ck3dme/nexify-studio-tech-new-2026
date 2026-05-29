export type CatalogCategoryId =
  | "web-development"
  | "mobile-apps"
  | "ai-solutions"
  | "security";

export type BillingPeriod = "one-time" | "monthly";

export type CatalogCategory = {
  id: CatalogCategoryId;
  name: string;
  description: string;
};

export type PricingTier = {
  id: string;
  name: string;
  price: number | null;
  currency: "EUR";
  billingPeriod: BillingPeriod;
  description?: string;
  isPopular?: boolean;
  features: string[];
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: CatalogCategoryId;
  shortDescription: string;
  features: string[];
  pricing: PricingTier[];
  featured?: boolean;
  technicalDetails?: Record<string, string[]>;
  timeline?: string;
  support?: string;
  idealFor?: string[];
  aiModels?: string[];
  contentTypes?: string[];
  deliverables?: string[];
  owasp?: string;
};
