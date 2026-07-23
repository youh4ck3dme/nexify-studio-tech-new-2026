import { describe, expect, it } from "vitest";
import {
  loadManifest,
  publicFileExists,
  readProjectFile,
} from "./checks";

describe("PWA", () => {
  const manifest = loadManifest();

  it("1/10 manifest má Nexify branding (name, short_name)", () => {
    expect(manifest.name).toBe("KEstudio");
    expect(manifest.short_name).toBe("KEstudio");
  });

  it("2/10 manifest má polia pre inštaláciu (standalone, start_url, scope)", () => {
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
  });

  it("3/10 manifest obsahuje ikony 192×192 a 512×512 (purpose any)", () => {
    const sizes = manifest.icons?.map((icon) => icon.sizes) ?? [];
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
  });

  it("4/10 manifest obsahuje maskable ikonu", () => {
    const maskable = (manifest.icons || []).find(
      (icon) => icon.purpose?.includes("maskable")
    );
    expect(maskable).toBeDefined();
  });

  it("5/10 všetky ikony z manifestu existujú v public/", () => {
    for (const icon of manifest.icons || []) {
      expect(publicFileExists(icon.src)).toBe(true);
    }
  });

  it("6/10 favicon a app ikony existujú v app/", () => {
    expect(readProjectFile("app/icon.png")).toBeDefined();
    expect(readProjectFile("app/apple-icon.png")).toBeDefined();
    expect(readProjectFile("app/favicon.ico")).toBeDefined();
  });

  it("7/10 service worker má offline fallback na /~offline", () => {
    const sw = readProjectFile("app/sw.ts");
    expect(sw).toContain('url: "/~offline"');
    expect(sw).toContain('request.destination === "document"');
  });

  it("8/10 service worker nikdy necachuje API (NetworkOnly)", () => {
    const sw = readProjectFile("app/sw.ts");
    expect(sw).toContain("NetworkOnly");
    expect(sw).toContain('url.pathname.startsWith("/api/")');
  });

  it("9/10 next.config zapína Serwist (swSrc → public/sw.js)", () => {
    const config = readProjectFile("next.config.mjs");
    expect(config).toContain('swSrc: "app/sw.ts"');
    expect(config).toContain('swDest: "public/sw.js"');
    expect(config).toContain('url: "/~offline"');
  });

  it("10/10 PWA komponenty a offline stránka sú v projekte", () => {
    expect(publicFileExists("/manifest.json")).toBe(true);
    expect(readProjectFile("app/~offline/page.tsx")).toContain("Ste offline");
    expect(readProjectFile("components/pwa/service-worker-registrar.tsx")).toContain(
      "/sw.js"
    );
    expect(readProjectFile("components/pwa/install-prompt.tsx")).toContain(
      "beforeinstallprompt"
    );
    const layout = readProjectFile("app/layout.tsx");
    expect(layout).toContain("manifest: '/manifest.json'");
    expect(layout).toContain("ServiceWorkerRegistrar");
  });
});
