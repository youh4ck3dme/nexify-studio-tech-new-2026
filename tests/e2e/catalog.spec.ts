import { expect, test } from "@playwright/test";

test.describe("Catalog", () => {
  test("6/30 loads catalog page", async ({ page }) => {
    await page.goto("/produkty");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Kompletný produktový katalóg"
    );
  });

  test("7/30 shows all product cards by default", async ({ page }) => {
    await page.goto("/produkty");
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(
      7
    );
  });

  test("8/30 filters web-development category", async ({ page }) => {
    await page.goto("/produkty");
    await page.getByRole("button", { name: "Digitálny vývoj a inžinierstvo" }).click();
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(2);
  });

  test("9/30 filters mobile-apps category", async ({ page }) => {
    await page.goto("/produkty");
    await page.getByRole("button", { name: "Mobilné aplikácie" }).click();
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(2);
  });

  test("10/30 filters ai-solutions category", async ({ page }) => {
    await page.goto("/produkty");
    await page.getByRole("button", { name: "AI-powered riešenia" }).click();
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(2);
  });

  test("11/30 filters security category", async ({ page }) => {
    await page.goto("/produkty");
    await page.getByRole("button", { name: "Bezpečnostné služby" }).click();
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(1);
  });

  test("12/30 reset filter shows all products", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    await page.goto("/produkty");
    await page.getByRole("button", { name: "Bezpečnostné služby" }).click();
    await page.getByRole("button", { name: "Všetko", exact: true }).click();
    await expect(page.getByRole("link", { name: "Detail produktu" })).toHaveCount(7);
  });

  test("13/30 homepage category marquee links to catalog", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    await page.goto("/#produkty");
    await expect(page.locator("#produkty")).toBeVisible();
    await expect(
      page.locator("#produkty").getByRole("heading", { name: /Jednoduché a transparentné/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Kategória: Firemné weby" }).first()
    ).toHaveAttribute("href", "/sluzby/firemne-weby");
    await page.locator("#produkty").getByRole("link", { name: "Zobraziť celý katalóg" }).click();
    await expect(page).toHaveURL(/\/produkty$/);
  });
});
