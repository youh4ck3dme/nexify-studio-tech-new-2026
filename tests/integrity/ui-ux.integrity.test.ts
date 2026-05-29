import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

function read(relative: string) {
  return readFileSync(path.join(root, relative), "utf-8");
}

describe("integrity: UI/UX theme and visibility", () => {
  const layout = read("app/layout.tsx");
  const globals = read("app/globals.css");
  const themeProvider = read("components/theme-provider.tsx");
  const themeToggle = read("components/theme-toggle.tsx");
  const navigation = read("components/landing/navigation.tsx");

  it("50/61 theme provider uses class attribute for html toggling", () => {
    expect(themeProvider).toContain("attribute = 'class'");
    expect(layout).toContain('attribute="class"');
    expect(layout).toContain("ThemeProvider");
  });

  it("51/61 FOUC prevention script is injected in layout head", () => {
    expect(layout).toContain("<ThemeScript />");
    expect(themeProvider).toContain("export function ThemeScript");
    expect(themeProvider).toContain("root.classList.toggle('dark', isDark)");
    expect(themeProvider).toContain("const STORAGE_KEY = 'theme'");
    expect(themeProvider).toContain("localStorage.getItem('${STORAGE_KEY}')");
  });

  it("52/61 layout suppresses hydration warnings on html and body", () => {
    expect(layout).toMatch(/<html[^>]*suppressHydrationWarning/);
    expect(layout).toMatch(/<body[^>]*suppressHydrationWarning/);
  });

  it("53/61 globals.css defines AMOLED dark palette", () => {
    expect(globals).toContain("@custom-variant dark");
    expect(globals).toMatch(/\.dark\s*\{[\s\S]*--background:\s*#000000/);
    expect(globals).toMatch(/\.dark\s*\{[\s\S]*--foreground:\s*#EDEDED/);
    expect(globals).toContain("color-scheme: dark");
  });

  it("54/61 globals.css defines Apple-grade light palette", () => {
    expect(globals).toMatch(/:root\s*\{[\s\S]*--background:\s*#FCFCFC/);
    expect(globals).toMatch(/:root\s*\{[\s\S]*--foreground:\s*#1D1D1F/);
    expect(globals).toContain("color-scheme: light");
  });

  it("55/61 tailwind theme maps background and foreground tokens", () => {
    expect(globals).toContain("--color-background: var(--background)");
    expect(globals).toContain("--color-foreground: var(--foreground)");
    expect(globals).toMatch(/body\s*\{[\s\S]*@apply bg-background text-foreground/);
  });

  it("56/61 viewport themeColor matches light and dark backgrounds", () => {
    expect(layout).toContain("themeColor:");
    expect(layout).toContain("color: '#FCFCFC'");
    expect(layout).toContain("color: '#000000'");
  });

  it("57/61 theme toggle is client-only with hydration-safe skeleton", () => {
    expect(themeToggle).toContain("'use client'");
    expect(themeToggle).toContain("const [mounted, setMounted] = useState(false)");
    expect(themeToggle).toMatch(/if\s*\(!mounted\)/);
    expect(themeToggle).toContain("aria-hidden");
  });

  it("58/61 theme toggle exposes accessible labels and glass styling", () => {
    expect(themeToggle).toContain("aria-label={isDark ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}");
    expect(themeToggle).toContain("backdrop-blur");
    expect(themeToggle).toContain("focus-visible:ring-2");
    expect(themeToggle).toContain("from 'lucide-react'");
  });

  it("59/61 navigation renders theme toggle on desktop and mobile", () => {
    expect(navigation).toContain('import { ThemeToggle } from "@/components/theme-toggle"');
    expect(navigation.match(/<ThemeToggle/g)?.length).toBe(2);
  });

  it("60/61 globals.css includes visibility and motion accessibility utilities", () => {
    expect(globals).toContain(".safe-top");
    expect(globals).toContain(".safe-bottom");
    expect(globals).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globals).toContain("focus-visible");
  });

  it("61/61 theme toggle and provider files exist on disk", () => {
    expect(existsSync(path.join(root, "components/theme-toggle.tsx"))).toBe(true);
    expect(existsSync(path.join(root, "components/theme-provider.tsx"))).toBe(true);
  });
});
