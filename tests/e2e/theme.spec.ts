import { expect, test } from "@playwright/test";

test.describe("theme toggle visibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
  });

  test("theme toggle is visible on desktop navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Prepnúť na (svetlý|tmavý) režim/i });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveCSS("width", "40px");
    await expect(toggle).toHaveCSS("height", "40px");
  });

  test("theme toggle switches html dark class", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    const toggle = page.getByRole("button", { name: /Prepnúť na tmavý režim/i });
    await expect(toggle).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("button", { name: /Prepnúť na svetlý režim/i }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("dark mode keeps hero text visible", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.reload();

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
