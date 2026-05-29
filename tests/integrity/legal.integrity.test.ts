import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { companyLegal } from "@/lib/legal";

const root = path.resolve(__dirname, "../..");

describe("integrity: legal", () => {
  it("44/49 company legal has ICO 31677517", () => {
    expect(companyLegal.ico).toBe("31677517");
    expect(companyLegal.legalName).toBe("MA.GI.CA., s.r.o.");
  });

  it("45/49 privacy page exists", () => {
    expect(
      existsSync(path.join(root, "app/pravne/ochrana-sukromia/page.tsx"))
    ).toBe(true);
  });

  it("46/49 terms page exists", () => {
    expect(existsSync(path.join(root, "app/pravne/podmienky/page.tsx"))).toBe(true);
  });

  it("47/49 cookies page exists", () => {
    expect(existsSync(path.join(root, "app/pravne/cookies/page.tsx"))).toBe(true);
  });

  it("48/49 footer links to privacy page", () => {
    const footer = readFileSync(
      path.join(root, "components/landing/footer-section.tsx"),
      "utf-8"
    );
    expect(footer).toContain("legalRoutes.privacy");
    expect(footer).toContain("Ochrana súkromia");
  });

  it("49/49 sitemap and robots exist", () => {
    expect(existsSync(path.join(root, "app/sitemap.ts"))).toBe(true);
    expect(existsSync(path.join(root, "app/robots.ts"))).toBe(true);
  });
});
