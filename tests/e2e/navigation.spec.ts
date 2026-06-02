import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("21/30 logo navigates home", async ({ page }) => {
    await page.goto("/produkty");
    await page.locator("header").getByRole("link", { name: "Nexify Studio" }).click();
    await expect(page).toHaveURL("/");
  });

  test("22/30 produkty nav link works", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    await page.goto("/");
    const desktopLink = page.getByRole("navigation").getByRole("link", { name: "Produkty" });
    if (await desktopLink.isVisible()) {
      await desktopLink.click();
    } else {
      await page.getByRole("button", { name: "Otvoriť menu" }).click();
      await page.getByRole("link", { name: "Produkty" }).click();
    }
    await expect(page).toHaveURL(/\/#produkty$/);
    await expect(page.locator("#produkty")).toBeVisible();
  });

  test("23/30 breadcrumb on product detail", async ({ page }) => {
    await page.goto("/produkty/pwa-aplikacia");
    await expect(
      page.locator("main section nav").getByRole("link", { name: "Produkty" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Progressive webová aplikácia"
    );
  });

  test("24/30 footer catalog link", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("footer")
      .getByRole("link", { name: "Katalóg produktov", exact: true })
      .click();
    await expect(page).toHaveURL(/\/produkty$/);
  });

  test("25/30 mobile menu opens and navigates", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Otvoriť menu" }).click();
    await page.getByRole("link", { name: "Produkty" }).click();
    await expect(page).toHaveURL(/\/#produkty$/);
    await expect(page.locator("#produkty")).toBeVisible();
  });
});
