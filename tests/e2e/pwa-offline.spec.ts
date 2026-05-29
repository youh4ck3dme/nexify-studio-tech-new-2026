import { expect, test } from "@playwright/test";

test.describe("PWA offline", () => {
  test("offline page renders fallback content", async ({ page }) => {
    await page.goto("/~offline");
    await expect(page.getByRole("heading", { name: "Ste offline" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Späť na úvod" })).toBeVisible();
  });

  test("offline page stays visible when connection drops", async ({ page, context }) => {
    await page.goto("/~offline");
    await expect(page.getByRole("heading", { name: "Ste offline" })).toBeVisible();
    await context.setOffline(true);
    await expect(page.getByRole("heading", { name: "Ste offline" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Späť na úvod" })).toBeVisible();
  });

  test("manifest has standalone display and icons", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBeTruthy();
    const manifest = (await response.json()) as {
      display?: string;
      icons?: Array<{ sizes: string }>;
    };
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons?.length).toBeGreaterThanOrEqual(2);
  });
});
