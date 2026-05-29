import type { TechProvider } from "@/lib/tech-providers";

type ProviderWordmarkProps = {
  provider: TechProvider;
};

export function ProviderWordmark({ provider }: ProviderWordmarkProps) {
  const monoIds = new Set(["github", "firebase", "codex", "copilot"]);
  const isMono = monoIds.has(provider.id);
  const fontSize = provider.label.length > 10 ? 22 : 26;

  return (
    <svg
      role="img"
      aria-label={provider.name}
      viewBox="0 0 260 48"
      className="h-8 md:h-10 w-auto shrink-0 text-foreground/30 hover:text-foreground transition-colors duration-300"
      fill="currentColor"
    >
      <text
        x="0"
        y="34"
        style={{
          fontFamily: isMono
            ? "var(--font-jetbrains), ui-monospace, monospace"
            : "var(--font-instrument-serif), ui-serif, serif",
          fontSize,
          fontWeight: 700,
          letterSpacing: provider.id === "antigravity" ? "-0.03em" : "0.02em",
        }}
      >
        {provider.label}
      </text>
    </svg>
  );
}
