import { expect, test } from "@playwright/test";

test.describe("Mobile Menu Interaction", () => {
  test.beforeEach(async ({ page }) => {
    // Grant cookie consent to avoid overlays
    await page.addInitScript(() => {
      localStorage.setItem("nexify-cookie-consent-v1", "all");
    });
    // Set mobile viewport size
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
  });

  test("should open menu and close it via the Späť button", async ({ page }) => {
    // Menu should be closed initially
    await expect(page.getByRole("button", { name: "Späť" })).not.toBeVisible();

    // Open mobile menu
    await page.getByRole("button", { name: "Otvoriť menu" }).click();
    
    // Späť button should be visible inside the overlay
    const backButton = page.getByRole("button", { name: "Späť" });
    await expect(backButton).toBeVisible();

    // Click Späť button
    await backButton.click();

    // Menu should close
    await expect(page.getByRole("button", { name: "Späť" })).not.toBeVisible();
  });

  test("should close menu on Escape key press", async ({ page }) => {
    // Open mobile menu
    await page.getByRole("button", { name: "Otvoriť menu" }).click();
    await expect(page.getByRole("button", { name: "Späť" })).toBeVisible();

    // Press Escape key
    await page.keyboard.press("Escape");

    // Menu should close
    await expect(page.getByRole("button", { name: "Späť" })).not.toBeVisible();
  });

  test("should close menu when user navigates back (swipe back / browser back)", async ({ page }) => {
    // Open mobile menu
    await page.getByRole("button", { name: "Otvoriť menu" }).click();
    await expect(page.getByRole("button", { name: "Späť" })).toBeVisible();

    // Emulate browser back button navigation
    await page.goBack();

    // Menu should close instead of navigating away from the website
    await expect(page.getByRole("button", { name: "Späť" })).not.toBeVisible();
    await expect(page).toHaveURL("/");
  });
});
