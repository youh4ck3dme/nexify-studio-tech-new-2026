import { expect, test } from "@playwright/test";

test.describe("CRM Module E2E", () => {
  // Clear IndexedDB and PWA Service Worker/Cache before each test to ensure a clean state
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      // Clear all caches
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
      // Access IndexedDB and delete database NexifyDatabase
      await new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase("NexifyDatabase");
        req.onsuccess = () => resolve();
        req.onerror = () => reject(new Error("Failed to delete database"));
      });
    });
  });

  test("Verify Client CRUD Lifecycle & Detail Profile", async ({ page }) => {
    // Listen for browser logs/errors
    page.on("console", msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on("pageerror", err => console.error('BROWSER_PAGEERROR:', err.message, err.stack));

    // Perform login to obtain auth token
    await page.goto("/login");
    const password = process.env.ADMIN_PASSWORD || process.env.CRM_PASSWORD || "23513900";
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    // Wait for navigation to CRM after successful login
    await page.waitForURL('**/crm');


    // Log page HTML for debugging
    const html = await page.content();
    console.log('PAGE_HTML:', html);
    
    // 1. Check title and empty state
    await page.screenshot({ path: 'crm-debug.png' });
    // Wait for CRM heading to appear
    await page.waitForSelector('h1:has-text("Interné CRM")', { timeout: 10000 });
    const heading = page.getByRole('heading', { name: 'Interné CRM', level: 1 });
    await expect(heading).toBeVisible();
    await expect(page.locator("text=Žiadni klienti nezodpovedajú vybraným filtrom.")).toBeVisible();

    // 2. Add client via ClientForm
    await page.getByPlaceholder("Názov firmy s.r.o.").fill("Test Company E2E");
    await page.getByPlaceholder("Jozef Mrkva").fill("John E2E Doe");
    await page.getByPlaceholder("firma@example.com").fill("e2e@example.com");
    await page.getByPlaceholder("+421 900 000 000").fill("+421901111222");
    await page.getByPlaceholder("https://www.firma.sk").fill("https://e2e-test.com");
    await page.getByPlaceholder("e.g. 2000 €").fill("3000 €");
    await page.getByPlaceholder("Poznámka").fill("This is a notes field for testing.");
    
    // Select a status and service
    await page.locator("select").nth(0).selectOption("SEO"); // Služba
    await page.locator("select").nth(1).selectOption("Nacenenie"); // Status

    // Submit
    await page.getByRole("button", { name: "Uložiť klienta do CRM" }).click();

    // Verify client appears in listing
    await expect(page.locator("text=Test Company E2E")).toBeVisible();
    await expect(page.locator("text=John E2E Doe")).toBeVisible();
    await expect(page.locator("text=e2e@example.com")).toBeVisible();
    
    // Check top stats updated
    // Potential budget = 3000
    await expect(page.locator("text=3 000 €")).toBeVisible();
    await expect(page.locator("text=Aktívni klienti").locator("xpath=..").locator("text=1")).toBeVisible();

    // 3. Edit client
    await page.getByRole("button", { name: "Upraviť" }).click();
    
    // Form should prefill
    await expect(page.getByPlaceholder("Názov firmy s.r.o.")).toHaveValue("Test Company E2E");
    
    // Change Company Name and budget
    await page.getByPlaceholder("Názov firmy s.r.o.").fill("Test Company E2E Edited");
    await page.getByPlaceholder("e.g. 2000 €").fill("4500 €");
    await page.getByRole("button", { name: "Uložiť zmeny" }).click();

    // Verify updated details
    await expect(page.locator("text=Test Company E2E Edited")).toBeVisible();
    await expect(page.locator("text=4 500 €")).toBeVisible();

    // 4. View Detail Profile Page
    await page.getByRole("link", { name: "Zobraziť profil" }).click();
    
    // Expect URL match
    await expect(page).toHaveURL(/\/crm\/\d+/);
    await expect(page.getByRole("heading", { name: "Test Company E2E Edited", level: 1 })).toBeVisible();

    // 5. Add a task
    await page.getByPlaceholder("Pridať novú úlohu...").fill("Perform manual QA E2E");
    // Optionally set a due date
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill("2026-12-31");
    await page.getByRole("button", { name: "Pridať" }).click();

    // Verify task is present
    await expect(page.locator("text=Perform manual QA E2E")).toBeVisible();
    await expect(page.locator("text=Termín: 31.12.2026")).toBeVisible();

    // Toggle task to done
    await page.locator("text=Perform manual QA E2E").click();
    // Task count should display as 1 / 1
    await expect(page.locator("text=1 / 1")).toBeVisible();

    // Delete task
    const taskItem = page.locator('div.group:has-text("Perform manual QA E2E")');
    await taskItem.hover();
    await taskItem.locator("button").nth(1).click();
    await expect(page.locator("text=Perform manual QA E2E")).not.toBeVisible();

    // 6. Add manual Activity Log
    await page.locator("select").nth(1).selectOption("call"); // Call activity
    await page.getByPlaceholder("Napr. Telefonát s riaditeľom").fill("E2E Call Verification");
    await page.getByPlaceholder("Dohodli sme sa na zaslaní cenovej ponuky do piatku...").fill("Detailed call discussion summary");
    await page.getByRole("button", { name: "Uložiť aktivitu" }).click();

    // Verify activity on timeline
    await expect(page.locator("text=E2E Call Verification")).toBeVisible();
    await expect(page.locator("text=Detailed call discussion summary")).toBeVisible();

    // 7. Check automatic Status Change log
    // Modify status select at top header
    await page.locator("select").nth(0).selectOption("Vo vývoji");
    await expect(page.locator("text=Zmena stavu")).toBeVisible();
    await expect(page.locator('text=Stav zmenený z "Nacenenie" na "Vo vývoji"')).toBeVisible();

    // 8. Go back to dashboard & Soft Delete
    await page.getByRole("button", { name: "Späť na CRM" }).click();
    await expect(page).toHaveURL(/\/crm$/);

    // Click trash button to soft delete (not permanent yet)
    await page.locator('button[title="Zmazať (presunúť do koša)"]').click();
    // Verification: listing should be empty now
    await expect(page.locator("text=Test Company E2E Edited")).not.toBeVisible();
    await expect(page.locator("text=Žiadni klienti nezodpovedajú vybraným filtrom.")).toBeVisible();
    
    // Check Recycle Bin count is (1)
    await expect(page.locator("text=Kôš (1)")).toBeVisible();

    // Toggle Recycle bin view
    await page.locator("text=Kôš (1)").click();
    await expect(page.locator("text=Test Company E2E Edited")).toBeVisible();

    // 9. Restore Client
    // Click restore icon (RotateCcw)
    await page.locator('button[title="Obnoviť"]').click();
    await expect(page.locator("text=Test Company E2E Edited")).not.toBeVisible(); // Gone from trash
    
    // Toggle Recycle Bin off
    await page.locator('button:has-text("Kôš")').click();
    await expect(page.locator("text=Test Company E2E Edited")).toBeVisible(); // Back to active

    // 10. Permanent Delete
    // Delete again (trash button)
    await page.locator('button[title="Zmazať (presunúť do koša)"]').click();
    await page.locator("text=Kôš (1)").click();
    
    // Enable dialog intercept to confirm permanent deletion
    page.on("dialog", (dialog) => dialog.accept());
    await page.locator('button[title="Trvalo vymazať"]').click();

    // Verify it is completely gone
    await expect(page.locator("text=Test Company E2E Edited")).not.toBeVisible();
    await expect(page.locator("text=Žiadni klienti nezodpovedajú vybraným filtrom.")).toBeVisible();
  });
});
