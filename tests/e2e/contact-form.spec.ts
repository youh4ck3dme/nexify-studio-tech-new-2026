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
    await page.locator("#contact").getByRole("button", { name: "Kontaktujte nás" }).scrollIntoViewIfNeeded();
    await page.locator("#contact").getByRole("button", { name: "Kontaktujte nás" }).click();
    await expect(page.getByText("Meno, email a správa sú povinné.")).toBeVisible();
  });

  test("27/30 blocks invalid email via browser validation", async ({ page }) => {
    await page.getByPlaceholder("Meno").fill("Test User");
    await page.getByPlaceholder("Email").fill("not-an-email");
    await page.getByPlaceholder("Vaša správa").fill("Hello");
    const valid = await page.getByPlaceholder("Email").evaluate(
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

    await page.getByPlaceholder("Meno").fill("E2E Test");
    await page.getByPlaceholder("Email").fill("e2e@example.com");
    await page.getByPlaceholder("Vaša správa").fill("Playwright test message");
    await page.locator("#contact").getByRole("button", { name: "Kontaktujte nás" }).scrollIntoViewIfNeeded();
    await page.locator("#contact").getByRole("button", { name: "Kontaktujte nás" }).click();
    await expect(
      page.locator("#contact").getByText("Správa bola odoslaná. Ozveme sa čo najskôr.")
    ).toBeVisible();
  });
});
