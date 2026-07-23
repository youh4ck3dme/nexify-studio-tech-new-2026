import type { Page } from "@playwright/test";

// Every login-based test hits the same real per-IP rate limiter
// (lib/auth/rate-limit.ts) that protects the real login endpoint. Running
// the full suite in parallel would otherwise mean dozens of logins all
// appearing to come from 127.0.0.1 within the same window and tripping it -
// so each test is given its own synthetic client IP via X-Forwarded-For,
// the same way distinct real clients would naturally have distinct IPs.
// This does not touch or weaken the production rate-limit logic.
function randomTestClientIp(): string {
  const octet = () => Math.floor(Math.random() * 255) + 1;
  return `10.${octet()}.${octet()}.${octet()}`;
}

/** Give the current test its own synthetic client IP so it gets its own
 * login rate-limit bucket, independent of every other test in the suite. */
export async function isolateLoginRateLimit(page: Page): Promise<void> {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": randomTestClientIp() });
}

export async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.ADMIN_EMAIL || "admin@kestudio.sk";
  const password = process.env.ADMIN_PASSWORD_PLAINTEXT || "2351900";

  await isolateLoginRateLimit(page);
  await page.goto("/login");
  await page.fill("input[name='email']", email);
  await page.fill("input[name='password']", password);
  await page.click("button[type='submit']");
  await page.waitForURL("**/crm");
}
