import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

describe("integrity: repo configuration", () => {
  it("40/40 .env.example documents Resend variables", () => {
    const envExample = readFileSync(path.join(root, ".env.example"), "utf-8");
    expect(envExample).toContain("RESEND_API_KEY");
    expect(envExample).toContain("CONTACT_TO_EMAIL");
  });

  it("41/40 README documents test scripts", () => {
    const readme = readFileSync(path.join(root, "README.md"), "utf-8");
    expect(readme).toContain("pnpm test");
  });

  it("42/40 package.json defines dev and test scripts", () => {
    const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.dev).toBe("next dev --webpack");
    expect(pkg.scripts.dev).not.toMatch(/\s-p\s+\d+/);
    expect(pkg.scripts["test:e2e"]).toBeTruthy();
    expect(pkg.scripts["test:integrity"]).toBeTruthy();
  });

  it("43/40 playwright config and tests folder exist", () => {
    expect(existsSync(path.join(root, "playwright.config.ts"))).toBe(true);
    expect(existsSync(path.join(root, "tests/e2e/home.spec.ts"))).toBe(true);
    expect(existsSync(path.join(root, "tests/integrity/catalog.integrity.test.ts"))).toBe(
      true
    );
  });
});
