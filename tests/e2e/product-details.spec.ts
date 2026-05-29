import { expect, test } from "@playwright/test";

const productSlugs = [
  { slug: "firemna-webova-stranka", title: "Firemná Webová Stránka", n: 14 },
  { slug: "ecommerce-platforma", title: "eCommerce Platforma", n: 15 },
  { slug: "pwa-aplikacia", title: "Progressive Web Aplikácia", n: 16 },
  { slug: "nativna-mobilna-aplikacia", title: "Natívna Mobilná Aplikácia", n: 17 },
  { slug: "ai-chatbot-pre-firmy", title: "AI Chatbot pre Firmy", n: 18 },
  { slug: "ai-generator-obsahu", title: "AI Generátor Obsahu", n: 19 },
  { slug: "penetracne-testovanie", title: "Penetračné Testovanie", n: 20 },
] as const;

for (const { slug, title, n } of productSlugs) {
  test(`${n}/30 product detail ${slug}`, async ({ page }) => {
    await page.goto(`/produkty/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
    await expect(page.getByRole("heading", { name: "Balíky a ceny" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kontaktovať nás" }).first()).toBeVisible();
  });
}
