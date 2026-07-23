import { expect, test } from "@playwright/test";
import { loginAsAdmin, isolateLoginRateLimit } from "./utils/auth";

test.setTimeout(60000);

test.describe("Authorization Page E2E", () => {
  test("should render credentials login page with no Google login", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1")).toHaveText("KEstudio");

    // Overíme, že Google prihlasovanie NIE JE prítomné
    const googleButton = page.locator("button:has-text('Google')");
    await expect(googleButton).not.toBeVisible();

    // Skontrolujeme prítomnosť polí pre email a heslo
    const emailInput = page.locator("input[name='email']");
    const passwordInput = page.locator("input[name='password']");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(page.locator("button[type='submit']")).toContainText("Sign In");
  });

  test("forgot password button should be disabled", async ({ page }) => {
    await page.goto("/login");

    const forgotButton = page.getByRole("button", { name: /Zabudnuté heslo/i });
    await expect(forgotButton).toBeDisabled();
  });

  test("should redirect unauthenticated users away from /crm", async ({ page }) => {
    await page.goto("/crm");
    await page.waitForURL("**/login**");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should show generic error on incorrect credentials", async ({ page }) => {
    await isolateLoginRateLimit(page);
    await page.goto("/login");

    await page.fill("input[name='email']", "admin@kestudio.sk");
    await page.fill("input[name='password']", "wrong-password-123");
    await page.click("button[type='submit']");

    const errorBox = page.locator("text=Invalid credentials.");
    await expect(errorBox).toBeVisible();
  });

  test("should show generic error on unknown email (no user enumeration)", async ({ page }) => {
    await isolateLoginRateLimit(page);
    await page.goto("/login");

    await page.fill("input[name='email']", "not-the-admin@kestudio.sk");
    await page.fill("input[name='password']", process.env.ADMIN_PASSWORD_PLAINTEXT || "2351900");
    await page.click("button[type='submit']");

    const errorBox = page.locator("text=Invalid credentials.");
    await expect(errorBox).toBeVisible();
  });

  // 3x Smoke Test pre prihlásenie emailom + heslom
  for (let run = 1; run <= 3; run++) {
    test(`smoke test login attempt #${run}`, async ({ page }) => {
      await loginAsAdmin(page);
      await expect(page.locator("h1")).toContainText("Interné CRM");
    });
  }
});
