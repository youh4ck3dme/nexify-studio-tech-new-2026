import { expect, test } from "@playwright/test";

const legalPages = [
  { path: "/pravne/ochrana-sukromia", heading: "Ochrana súkromia" },
  { path: "/pravne/podmienky", heading: "Všeobecné obchodné podmienky" },
  { path: "/pravne/cookies", heading: "Zásady používania cookies" },
] as const;

for (const { path, heading } of legalPages) {
  test(`legal page ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.getByRole("complementary")).toContainText("MA.GI.CA., s.r.o.");
  });
}

test("footer privacy link navigates", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("footer")
    .getByRole("link", { name: "Ochrana súkromia" })
    .click();
  await expect(page).toHaveURL(/\/pravne\/ochrana-sukromia$/);
});
