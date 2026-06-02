import { expect, test } from "@playwright/test";

test.describe("PWA assets", () => {
  test("29/30 manifest is valid JSON with Nexify branding", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.ok()).toBeTruthy();
    const manifest = (await response.json()) as { name: string; icons: unknown[] };
    expect(manifest.name).toBe("Nexify Studio");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  test("30/30 offline page renders", async ({ page }) => {
    await page.goto("/~offline");
    await expect(page.getByRole("heading", { name: "Ste offline" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Späť na úvod" })).toBeVisible();
  });
});
