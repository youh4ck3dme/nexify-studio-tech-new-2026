import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");
const publicDir = path.join(root, "public");

function publicExists(relative: string) {
  const filePath = path.join(publicDir, relative.replace(/^\//, ""));
  return existsSync(filePath) && statSync(filePath).size > 0;
}

describe("integrity: manifest and PWA assets", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(publicDir, "manifest.json"), "utf-8")
  ) as {
    name: string;
    display: string;
    background_color: string;
    theme_color: string;
    icons: Array<{ src: string; sizes: string; purpose?: string }>;
  };

  it("23/40 manifest name is KEstudio", () => {
    expect(manifest.name).toBe("KEstudio");
  });

  it("24/40 manifest display is standalone", () => {
    expect(manifest.display).toBe("standalone");
  });

  it("25/40 manifest includes 192 and 512 icons", () => {
    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
  });

  it("26/40 manifest includes maskable icon", () => {
    expect(manifest.icons.some((icon) => icon.purpose?.includes("maskable"))).toBe(true);
  });

  it("27/40 all manifest icon files exist", () => {
    for (const icon of manifest.icons) {
      expect(publicExists(icon.src)).toBe(true);
    }
  });

  it("28/40 favicon and app icons exist in app directory", () => {
    const appDir = path.join(root, "app");
    expect(existsSync(path.join(appDir, "icon.png"))).toBe(true);
    expect(existsSync(path.join(appDir, "apple-icon.png"))).toBe(true);
    expect(existsSync(path.join(appDir, "favicon.ico"))).toBe(true);
  });

  it("29/40 service worker source configures offline fallback", () => {
    const sw = readFileSync(path.join(root, "app/sw.ts"), "utf-8");
    expect(sw).toContain('url: "/~offline"');
  });

  it("30/40 layout references manifest", () => {
    const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf-8");
    expect(layout).toContain("manifest: '/manifest.json'");
  });

  it("34/40 manifest uses AMOLED theme", () => {
    expect(manifest.theme_color).toBe("#000000");
    expect(manifest.background_color).toBe("#000000");
  });

  it("35/40 layout does not reference removed favicon.svg", () => {
    const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf-8");
    expect(layout).not.toContain("favicon.svg");
  });

  it("36/40 og-image exists for social previews", () => {
    expect(publicExists("/og-image.png")).toBe(true);
  });
});
