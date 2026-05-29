import type { CatalogProduct } from "../types";

export const aiChatbot: CatalogProduct = {
  id: "ai-chatbot-001",
  name: "AI Chatbot pre Firmy",
  slug: "ai-chatbot-pre-firmy",
  category: "ai-solutions",
  featured: true,
  shortDescription:
    "Inteligentný chatbot s GPT-4/Claude pre customer support a lead generation",
  features: [
    "Prirodzené jazykové spracovanie",
    "Podpora 50+ jazykov",
    "Kontextové rozumenie",
    "Trénovanie na vašich dátach",
    "Ľudský handoff",
    "Analytics dashboard",
    "24/7 dostupnosť",
    "Lead generation",
    "Automatické tickety",
    "Integrácia s CRM",
  ],
  aiModels: ["OpenAI GPT-4", "Anthropic Claude 3", "Google Gemini", "Custom models"],
  pricing: [
    {
      id: "starter",
      name: "Štart",
      price: 299,
      currency: "EUR",
      billingPeriod: "monthly",
      features: ["1000 rozhovorov/mesiac", "Základný AI model", "Email podpora"],
    },
    {
      id: "pro",
      name: "Profesionál",
      price: 599,
      currency: "EUR",
      billingPeriod: "monthly",
      isPopular: true,
      features: ["10,000 rozhovorov", "GPT-4/Claude", "Custom training", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Podnik",
      price: 1499,
      currency: "EUR",
      billingPeriod: "monthly",
      features: ["Unlimited rozhovory", "Dedikovaná inštancia", "Custom integrácie", "SLA"],
    },
  ],
};
