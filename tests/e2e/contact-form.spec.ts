import { expect, test } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    await page.goto("/#contact");
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("26/30 shows validation for empty submit", async ({ page }) => {
    await page.locator("#contact").getByRole("button", { name: "Vyžiadať si Demo" }).scrollIntoViewIfNeeded();
    await page.locator("#contact").getByRole("button", { name: "Vyžiadať si Demo" }).click();
    await expect(page.getByText("Meno, email a správa sú povinné.")).toBeVisible();
  });

  test("27/30 blocks invalid email via browser validation", async ({ page }) => {
    await page.getByPlaceholder("Vaše meno *").fill("Test User");
    await page.getByPlaceholder("Pracovný email *").fill("not-an-email");
    await page.getByPlaceholder("Ako vám môžeme pomôcť? *").fill("Hello");
    const valid = await page.getByPlaceholder("Pracovný email *").evaluate(
      (el) => (el as HTMLInputElement).checkValidity()
    );
    expect(valid).toBe(false);
  });

  test("28/30 submits successfully with mocked API", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByPlaceholder("Vaše meno *").fill("E2E Test");
    await page.getByPlaceholder("Pracovný email *").fill("e2e@example.com");
    await page.getByPlaceholder("Ako vám môžeme pomôcť? *").fill("Playwright test message");
    await page.locator("#contact").getByRole("button", { name: "Vyžiadať si Demo" }).scrollIntoViewIfNeeded();
    await page.locator("#contact").getByRole("button", { name: "Vyžiadať si Demo" }).click();
    await expect(
      page.locator("#contact").getByText("Správa bola úspešne odoslaná. Ozveme sa vám čoskoro.")
    ).toBeVisible();
  });
});
