import type { CatalogProduct } from "../types";

export const ecommercePlatform: CatalogProduct = {
  id: "ecom-001",
  name: "eCommerce Platforma",
  slug: "ecommerce-platforma",
  category: "web-development",
  featured: true,
  shortDescription:
    "Komplexné riešenie pre online predaj s payment gateway a inventory managementom",
  features: [
    "Nákupný košík a checkout",
    "Payment gateway (Stripe, PayPal, GoPay)",
    "Inventory management v reálnom čase",
    "Integrácia s kuriérskymi službami",
    "Predajná analytika a reporting",
    "Multi-currency podpora",
    "Bezpečné transakcie a SSL",
    "Email notifikácie objednávok",
    "Recenzie a hodnotenia produktov",
    "Kupóny a zľavy",
  ],
  pricing: [
    {
      id: "starter",
      name: "Štart",
      price: 3500,
      currency: "EUR",
      billingPeriod: "one-time",
      features: ["Do 100 produktov", "1 payment gateway", "Základný admin panel"],
    },
    {
      id: "business",
      name: "Biznis",
      price: 6500,
      currency: "EUR",
      billingPeriod: "one-time",
      isPopular: true,
      features: ["Do 1000 produktov", "Viacero payment gateway", "Pokročilá analytika"],
    },
    {
      id: "enterprise",
      name: "Podnik",
      price: 12000,
      currency: "EUR",
      billingPeriod: "one-time",
      features: ["Unlimited produkty", "Multi-vendor", "API access", "Dedicated support"],
    },
  ],
};
