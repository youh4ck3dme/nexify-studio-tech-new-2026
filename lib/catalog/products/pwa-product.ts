import type { CatalogProduct } from "../types";

export const pwaProduct: CatalogProduct = {
  id: "mobile-pwa-001",
  name: "Progressive webová aplikácia",
  slug: "pwa-aplikacia",
  category: "mobile-apps",
  featured: true,
  shortDescription:
    "Aplikácia s UX podobným natívnej aplikácii bez nutnosti sťahovania z obchodu",
  features: [
    "Funguje offline bez pripojenia k internetu",
    "Push notifikácie",
    "Bleskovo rýchla",
    "Automatické uloženie do domovskej obrazovky",
    "Funguje na iOS, Android aj Desktop",
    "Automatické aktualizácie",
    "Viacplatformová kompatibilita",
    "Offline-first architektúra",
    "Skúsenosť podobná natívnej aplikácii bez App Store",
  ],
  idealFor: [
    "Novinky a médiá",
    "E-commerce",
    "Sociálne siete",
    "Produktivita",
    "Obsahové platformy",
  ],
  pricing: [
    {
      id: "standard",
      name: "Štandardná PWA",
      price: 4000,
      currency: "EUR",
      billingPeriod: "one-time",
      features: ["Offline funkcionalita", "Push notifikácie", "6 mesiacov podpory"],
    },
    {
      id: "advanced",
      name: "Pokročilá PWA",
      price: 7500,
      currency: "EUR",
      billingPeriod: "one-time",
      isPopular: true,
      features: [
        "Backend integrácia",
        "User autentifikácia",
        "Real-time updates",
        "12 mesiacov podpory",
      ],
    },
  ],
};
