import { describe, expect, it } from "vitest";
import { corporateWebsite } from "@/lib/catalog/products/corporate-website";
import { ecommercePlatform } from "@/lib/catalog/products/ecommerce-platform";
import { pwaProduct } from "@/lib/catalog/products/pwa-product";
import { nativeMobileApp } from "@/lib/catalog/products/native-mobile-app";
import { aiChatbot } from "@/lib/catalog/products/ai-chatbot";
import { aiContentGenerator } from "@/lib/catalog/products/ai-content-generator";
import { penetrationTesting } from "@/lib/catalog/products/penetration-testing";
import { seoPackages } from "@/lib/catalog/products/seo-packages";

describe("integrity: product payloads", () => {
  it("13/40 corporate website has technicalDetails", () => {
    expect(corporateWebsite.technicalDetails?.Frontend).toContain("Next.js 14");
  });

  it("14/40 corporate website has timeline and support", () => {
    expect(corporateWebsite.timeline).toBeTruthy();
    expect(corporateWebsite.support).toBeTruthy();
  });

  it("15/40 ecommerce has three pricing tiers", () => {
    expect(ecommercePlatform.pricing).toHaveLength(3);
  });

  it("16/40 pwa product lists idealFor audiences", () => {
    expect(pwaProduct.idealFor?.length).toBeGreaterThanOrEqual(3);
  });

  it("17/40 native mobile has single and cross platform tiers", () => {
    expect(nativeMobileApp.pricing.map((t) => t.id)).toEqual(["single", "cross"]);
  });

  it("18/40 ai chatbot lists aiModels", () => {
    expect(aiChatbot.aiModels?.length).toBeGreaterThanOrEqual(3);
  });

  it("19/40 ai chatbot uses monthly billing", () => {
    expect(aiChatbot.pricing.every((t) => t.billingPeriod === "monthly")).toBe(true);
  });

  it("20/40 content generator lists contentTypes", () => {
    expect(aiContentGenerator.contentTypes?.length).toBeGreaterThanOrEqual(5);
  });

  it("21/40 penetration testing has deliverables", () => {
    expect(penetrationTesting.deliverables?.length).toBeGreaterThanOrEqual(4);
  });

  it("22/40 penetration testing documents OWASP methodology", () => {
    expect(penetrationTesting.owasp).toContain("OWASP");
  });

  it("23/40 seo packages has three monthly tiers", () => {
    expect(seoPackages.pricing).toHaveLength(3);
    expect(seoPackages.pricing.every((tier) => tier.billingPeriod === "monthly")).toBe(true);
  });

  it("24/40 seo packages includes faq and custom cta labels", () => {
    expect(seoPackages.faq?.length).toBeGreaterThanOrEqual(2);
    expect(seoPackages.pricing[1]?.isPopular).toBe(true);
    expect(seoPackages.pricing[0]?.ctaText).toContain("lokálnu");
  });
});
