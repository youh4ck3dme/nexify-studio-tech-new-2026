export type TechProvider = {
  id: string;
  name: string;
  label: string;
};

export const techProviders: TechProvider[] = [
  { id: "google-cloud", name: "Google Cloud", label: "Google Cloud" },
  { id: "vercel", name: "Vercel", label: "Vercel" },
  { id: "stripe", name: "Stripe", label: "Stripe" },
  { id: "github", name: "GitHub", label: "GitHub" },
  { id: "openai", name: "OpenAI", label: "OpenAI" },
  { id: "chatgpt", name: "ChatGPT", label: "ChatGPT" },
  { id: "perplexity", name: "Perplexity", label: "Perplexity" },
  { id: "lovable", name: "Lovable", label: "Lovable" },
  { id: "firebase", name: "Firebase Studio", label: "Firebase" },
  { id: "gemini", name: "Gemini", label: "Gemini" },
  { id: "mistral", name: "Mistral", label: "Mistral" },
  { id: "antigravity", name: "Antigravity", label: "Antigravity" },
  { id: "copilot", name: "Copilot", label: "Copilot" },
  { id: "codex", name: "Codex", label: "Codex" },
];
