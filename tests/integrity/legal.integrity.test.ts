import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { companyLegal } from "@/lib/legal";

const root = path.resolve(__dirname, "../..");

describe("integrity: legal", () => {
  it("41/46 company legal has ICO 31677517", () => {
    expect(companyLegal.ico).toBe("31677517");
    expect(companyLegal.legalName).toBe("MA.GI.CA., s.r.o.");
  });

  it("42/46 privacy page exists", () => {
    expect(
      existsSync(path.join(root, "app/pravne/ochrana-sukromia/page.tsx"))
    ).toBe(true);
  });

  it("43/46 terms page exists", () => {
    expect(existsSync(path.join(root, "app/pravne/podmienky/page.tsx"))).toBe(true);
  });

  it("44/46 cookies page exists", () => {
    expect(existsSync(path.join(root, "app/pravne/cookies/page.tsx"))).toBe(true);
  });

  it("45/46 footer links to privacy page", () => {
    const footer = readFileSync(
      path.join(root, "components/landing/footer-section.tsx"),
      "utf-8"
    );
    expect(footer).toContain("legalRoutes.privacy");
    expect(footer).toContain("Ochrana súkromia");
  });

  it("46/46 sitemap and robots exist", () => {
    expect(existsSync(path.join(root, "app/sitemap.ts"))).toBe(true);
    expect(existsSync(path.join(root, "app/robots.ts"))).toBe(true);
  });
});
