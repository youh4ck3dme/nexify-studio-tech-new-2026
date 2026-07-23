import type { TechProvider } from "@/lib/tech-providers";
import { cn } from "@/lib/utils";

type ProviderWordmarkProps = {
  provider: TechProvider;
};

function ProviderMark({ id }: { id: string }) {
  if (id === "google-cloud") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
        <path d="M10.4 22.8H22a5.6 5.6 0 0 0 .5-11.18 7.4 7.4 0 0 0-13.8 2.3A4.57 4.57 0 0 0 10.4 22.8Z" fill="none" stroke="#4285F4" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M8.7 13.92a7.4 7.4 0 0 1 6.77-4.43c2.4 0 4.54 1.14 5.9 2.9" fill="none" stroke="#34A853" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M22.5 11.62A5.6 5.6 0 0 1 22 22.8h-4.7" fill="none" stroke="#FBBC05" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M10.4 22.8a4.57 4.57 0 0 1-1.7-8.88" fill="none" stroke="#EA4335" strokeWidth="3.1" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "vercel") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0 text-foreground">
        <path d="M16 6.5 29 25.5H3L16 6.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (id === "stripe") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
        <rect width="32" height="32" rx="9" fill="#635BFF" />
        <path
          d="M17.06 14.2c-1.65-.58-2.2-1-2.2-1.72 0-.62.54-1.03 1.66-1.03 1.45 0 2.95.55 4.03 1.15V8.85c-.92-.43-2.3-.85-4.03-.85-3.62 0-5.98 1.9-5.98 4.84 0 2.5 1.7 3.57 4.65 4.62 1.9.67 2.45 1.08 2.45 1.8 0 .7-.62 1.1-1.85 1.1-1.5 0-3.4-.62-4.72-1.42v3.8c1.16.62 2.86 1.14 4.84 1.14 3.8 0 6.1-1.84 6.1-4.9 0-2.52-1.52-3.58-4.95-4.78Z"
          fill="#fff"
        />
      </svg>
    );
  }

  if (id === "firebase") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
        <path d="M6.5 24.5 10.2 2.8l5 9.4 3.2-6.1 7.1 18.4-9.6 5.1-9.4-5.1Z" fill="#FFCA28" />
        <path d="m15.2 12.2-8.7 12.3 11.9-18.4-3.2 6.1Z" fill="#FFA000" />
        <path d="m6.5 24.5 9.4 5.1 9.6-5.1-7.1-18.4-3.2 6.1-5-9.4-3.7 21.7Z" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
      </svg>
    );
  }

  if (id === "github") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0 text-foreground">
        <circle cx="16" cy="16" r="13" fill="currentColor" />
        <text x="16" y="20.4" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="var(--background)" fontFamily="ui-sans-serif, system-ui, sans-serif">
          GH
        </text>
      </svg>
    );
  }

  if (id === "openai" || id === "chatgpt" || id === "codex") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0 text-foreground">
        <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.1" opacity="0.9" />
        <path d="M16 7.5v17M8.6 12.3l14.8 7.4M8.6 19.7l14.8-7.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  }

  if (id === "gemini") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
        <path d="M16 3.5c1.8 6.3 6.2 10.7 12.5 12.5C22.2 17.8 17.8 22.2 16 28.5 14.2 22.2 9.8 17.8 3.5 16 9.8 14.2 14.2 9.8 16 3.5Z" fill="#8AB4F8" />
      </svg>
    );
  }

  const shortLabel = providerFallbackInitials[id] ?? id.slice(0, 2).toUpperCase();

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0 text-foreground">
      <rect x="3" y="3" width="26" height="26" rx="8" fill="currentColor" opacity="0.11" />
      <text x="16" y="20.7" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="currentColor" fontFamily="ui-sans-serif, system-ui, sans-serif">
        {shortLabel}
      </text>
    </svg>
  );
}

const providerFallbackInitials: Record<string, string> = {
  antigravity: "AG",
  copilot: "CP",
  lovable: "LV",
  mistral: "MI",
  perplexity: "PX",
};

export function ProviderWordmark({ provider }: ProviderWordmarkProps) {
  return (
    <div
      role="img"
      aria-label={provider.name}
      className={cn(
        "group/provider flex h-14 min-w-[176px] shrink-0 items-center gap-3 rounded-2xl px-4",
        "border border-foreground/10 bg-card/80 text-foreground/70 shadow-[0_10px_28px_-22px_color-mix(in_oklch,var(--foreground)_55%,transparent)] backdrop-blur-xl",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/18 hover:bg-card hover:text-foreground",
        "dark:bg-white/[0.035] dark:text-foreground/60 dark:hover:bg-white/[0.06] dark:hover:text-foreground"
      )}
    >
      <ProviderMark id={provider.id} />
      <span className="whitespace-nowrap font-sans text-[15px] font-semibold tracking-[-0.01em]">
        {provider.label}
      </span>
    </div>
  );
}
