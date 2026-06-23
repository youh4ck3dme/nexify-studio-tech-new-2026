import { expect, test } from "@playwright/test";

test.describe("Authorization Page E2E", () => {
  test("should render authorization page with all elements", async ({ page }) => {
    await page.goto("/login");

    // Skontrolujeme nadpisy a texty
    await expect(page.locator("h1")).toHaveText("Autorizácia");
    await expect(page.locator("text=Vyberte spôsob prihlásenia pre prístup do internej zóny.")).toBeVisible();

    // Skontrolujeme prítomnosť Google prihlasovacieho tlačidla
    const googleButton = page.locator("button:has-text('Prihlásiť sa cez Google')");
    await expect(googleButton).toBeVisible();

    // Skontrolujeme prítomnosť inputu pre kód a tlačidla
    const passwordInput = page.locator("input[name='password']");
    await expect(passwordInput).toBeVisible();
    await expect(page.locator("button[type='submit']")).toHaveText("Odomknúť prístup");
  });

  test("should show error on incorrect code", async ({ page }) => {
    await page.goto("/login");

    // Zadáme nesprávne heslo
    await page.fill("input[name='password']", "wrong-password-123");
    await page.click("button[type='submit']");

    // Očakávame chybovú hlášku
    const errorBox = page.locator("text=Nesprávny bezpečnostný kód");
    await expect(errorBox).toBeVisible();
  });

  test("should successfully login with correct code", async ({ page }) => {
    await page.goto("/login");

    // Získame heslo z premenných prostredia
    const password = process.env.ADMIN_PASSWORD || process.env.CRM_PASSWORD || "23513900";
    
    // Prihlásime sa
    await page.fill("input[name='password']", password);
    await page.click("button[type='submit']");

    // Očakávame presmerovanie do CRM
    await page.waitForURL("**/crm");
    await expect(page.locator("h1")).toContainText("Interné CRM");
  });
});
