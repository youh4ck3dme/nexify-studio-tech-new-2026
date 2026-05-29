import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allProducts } from "@/lib/catalog";

const root = path.resolve(__dirname, "../..");

describe("integrity: routes and pages", () => {
  it("31/40 static product slugs match catalog", () => {
    const slugPage = readFileSync(
      path.join(root, "app/produkty/[slug]/page.tsx"),
      "utf-8"
    );
    expect(slugPage).toContain("generateStaticParams");
    const slugs = allProducts.map((p) => p.slug);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("32/40 catalog page imports grid component", () => {
    const page = readFileSync(path.join(root, "app/produkty/page.tsx"), "utf-8");
    expect(page).toContain("CatalogGrid");
  });

  it("33/40 product detail page imports ProductDetail", () => {
    const page = readFileSync(
      path.join(root, "app/produkty/[slug]/page.tsx"),
      "utf-8"
    );
    expect(page).toContain("ProductDetail");
  });

  it("34/40 navigation links to produkty section", () => {
    const nav = readFileSync(
      path.join(root, "components/landing/navigation.tsx"),
      "utf-8"
    );
    expect(nav).toContain('href: "/#produkty"');
  });

  it("35/40 homepage includes category marquee section", () => {
    const page = readFileSync(path.join(root, "app/page.tsx"), "utf-8");
    expect(page).toContain("CategoryMarqueeSection");
  });

  it("36/40 offline page exists with Slovak copy", () => {
    const offline = readFileSync(
      path.join(root, "app/~offline/page.tsx"),
      "utf-8"
    );
    expect(offline).toContain("Ste offline");
  });
});
