import { expect, test } from "@playwright/test";

const services = [
  "firemne-weby",
  "ecommerce",
  "mobilne-aplikacie",
  "ai-riesenia",
  "bezpecnost",
] as const;

for (const slug of services) {
  test(`service page /sluzby/${slug}`, async ({ page }) => {
    await page.goto(`/sluzby/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nezáväzný dopyt" })).toBeVisible();
  });
}
