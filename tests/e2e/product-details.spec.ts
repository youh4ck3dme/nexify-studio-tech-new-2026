import { expect, test } from "@playwright/test";

const productSlugs = [
  { slug: "firemna-webova-stranka", title: "Firemná webová stránka", n: 14 },
  { slug: "ecommerce-platforma", title: "eCommerce Platforma", n: 15 },
  { slug: "pwa-aplikacia", title: "Progressive webová aplikácia", n: 16 },
  { slug: "nativna-mobilna-aplikacia", title: "Natívna mobilná aplikácia", n: 17 },
  { slug: "ai-chatbot-pre-firmy", title: "AI Chatbot pre Firmy", n: 18 },
  { slug: "ai-generator-obsahu", title: "AI generátor obsahu", n: 19 },
  { slug: "penetracne-testovanie", title: "Penetračné testovanie", n: 20 },
  { slug: "seo-baliky", title: "SEO balíky", n: 21, cta: "Získať lokálnu dominanciu" },
] as const;

for (const { slug, title, n, cta } of productSlugs) {
  test(`${n}/30 product detail ${slug}`, async ({ page }) => {
    await page.goto(`/produkty/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
    await expect(page.getByRole("heading", { name: "Balíky a ceny" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: cta ?? "Kontaktovať nás" }).first()
    ).toBeVisible();
  });
}
