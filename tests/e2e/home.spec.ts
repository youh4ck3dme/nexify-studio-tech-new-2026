import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("1/30 loads with Nexify Studio title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Nexify Studio/i);
  });

  test("2/30 shows hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Zviditeľnite sa"
    );
  });

  test("3/30 has services section", async ({ page }) => {
    await page.goto("/#services");
    await expect(page.locator("#services")).toBeVisible();
  });

  test("4/30 has pricing section", async ({ page }) => {
    await page.goto("/#pricing");
    await expect(page.locator("#pricing")).toBeVisible();
  });

  test("5/30 has contact section with form", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.getByPlaceholder("Meno")).toBeVisible();
  });
});
