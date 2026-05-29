import type { CatalogProduct } from "../types";

export const nativeMobileApp: CatalogProduct = {
  id: "mobile-native-001",
  name: "Natívna Mobilná Aplikácia",
  slug: "nativna-mobilna-aplikacia",
  category: "mobile-apps",
  shortDescription:
    "iOS a Android aplikácia s plnou funkčnosťou a prístupom k zariadeniu",
  features: [
    "Natívna výkonnosť",
    "Prístup k fotoaparátu a galérii",
    "GPS a geolokalizácia",
    "Biometrické autentifikácia",
    "In-app nákupy",
    "Push notifikácie",
    "Prístup na App Store a Google Play",
    "Offline funkcionalita",
    "Native design guidelines",
  ],
  pricing: [
    {
      id: "single",
      name: "Jedna platforma",
      price: 8000,
      currency: "EUR",
      billingPeriod: "one-time",
      description: "iOS ALEBO Android",
      features: ["Custom design", "Backend API", "App Store submission", "3 mesiace podpory"],
    },
    {
      id: "cross",
      name: "Obe platformy",
      price: 12000,
      currency: "EUR",
      billingPeriod: "one-time",
      isPopular: true,
      description: "iOS A Android",
      features: [
        "iOS + Android",
        "Zdieľaný kód (Flutter/RN)",
        "Obe obchody",
        "6 mesiacov podpory",
      ],
    },
  ],
};
