import { expect, test } from "@playwright/test";
import { findLowContrastText } from "./utils/contrast";
import { loginAsAdmin } from "./utils/auth";

test.setTimeout(60000);

const mobileViewports = [
  { name: "iphone-17-standard", width: 393, height: 852 },
  { name: "iphone-17-slim", width: 390, height: 844 },
  { name: "iphone-17-pro", width: 393, height: 852 },
  { name: "iphone-17-pro-max", width: 440, height: 956 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "iphone-se", width: 375, height: 667 },
] as const;

const iphone17Viewports = mobileViewports.filter((v) => v.name.startsWith("iphone-17"));

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
      await page.waitForURL(/#produkty/);
      await expect(page.locator("#produkty")).toBeVisible();
    });

    test("contact form is usable on mobile", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/#contact");
      await expect(page.getByPlaceholder("Vaše meno *")).toBeVisible();
      await expect(page.getByPlaceholder("Pracovný email *")).toBeVisible();
      await expect(page.getByRole("button", { name: "Vyžiadať si Demo" })).toBeVisible();
    });

    test("homepage has no low-contrast (invisible) text", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/");
      const issues = await findLowContrastText(page);
      expect(issues, `Low-contrast elements on / (${viewport.name}):\n${issues.join("\n")}`).toEqual([]);
    });

    test("login page has no low-contrast (invisible) text", async ({ page }) => {
      await page.goto("/login");
      const issues = await findLowContrastText(page);
      expect(issues, `Low-contrast elements on /login (${viewport.name}):\n${issues.join("\n")}`).toEqual([]);
    });

    test("produkty page has no low-contrast (invisible) text", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("nexify-cookie-consent-v1", "all");
      });
      await page.goto("/produkty");
      const issues = await findLowContrastText(page);
      expect(issues, `Low-contrast elements on /produkty (${viewport.name}):\n${issues.join("\n")}`).toEqual([]);
    });
  });
}

// Regression coverage for the /crm "white text on white background" bug,
// specifically on the iPhone 17 device family the bug was reported on.
test.describe("CRM readability on iPhone 17 family", () => {
  for (const viewport of iphone17Viewports) {
    test(`CRM dashboard has no low-contrast text on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await loginAsAdmin(page);
      await expect(page.getByRole("heading", { name: "Interné CRM" })).toBeVisible();
      const issues = await findLowContrastText(page);
      expect(issues, `Low-contrast elements on /crm (${viewport.name}):\n${issues.join("\n")}`).toEqual([]);
    });

    test(`CRM dashboard has no horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await loginAsAdmin(page);
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(overflow).toBe(false);
    });
  }
});

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

  test("CRM dashboard has no low-contrast text on tablet", async ({ page }) => {
    await loginAsAdmin(page);
    const issues = await findLowContrastText(page);
    expect(issues, `Low-contrast elements on /crm (ipad):\n${issues.join("\n")}`).toEqual([]);
  });
});
