import { expect, test } from "@playwright/test";

const mobileViewports = [
  { name: "iphone-14", width: 390, height: 844 },
  { name: "iphone-se", width: 375, height: 667 },
] as const;

for (const viewport of mobileViewports) {
  test.describe(`responsive ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("homepage has no horizontal overflow", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/");
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(overflow).toBe(false);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("mobile menu navigates to catalog section", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/");
      await page.getByRole("button", { name: "Otvoriť menu" }).click();
      await page.getByRole("link", { name: "Produkty" }).click();
      await expect(page).toHaveURL(/\/#produkty$/);
      await expect(page.locator("#produkty")).toBeVisible();
    });

    test("contact form is usable on mobile", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/#contact");
      await expect(page.getByPlaceholder("Meno")).toBeVisible();
      await expect(page.getByPlaceholder("Email")).toBeVisible();
      await expect(page.getByRole("button", { name: "Kontaktujte nás" })).toBeVisible();
    });
  });
}

test.describe("responsive ipad", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("catalog filter works on tablet", async ({ page }) => {
    await page.goto("/produkty");
    await page.getByRole("button", { name: "Všetko", exact: true }).click();
    await page.getByRole("button", { name: "Mobilné aplikácie" }).click();
    await expect(page.getByRole("heading", { name: "Progressive webová aplikácia" })).toBeVisible();
  });

  test("footer legal links clickable", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Ochrana súkromia" }).click();
    await expect(page).toHaveURL(/\/pravne\/ochrana-sukromia$/);
  });
});
