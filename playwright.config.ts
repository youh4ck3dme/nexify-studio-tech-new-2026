import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/responsive.spec.ts",
    },
    {
      name: "iphone-14",
      use: { ...devices["iPhone 14"] },
      testMatch: "**/responsive.spec.ts",
    },
    {
      name: "iphone-se",
      use: { ...devices["iPhone SE"] },
      testMatch: "**/responsive.spec.ts",
    },
    {
      name: "ipad",
      use: { ...devices["iPad (gen 7)"] },
      testMatch: "**/responsive.spec.ts",
    },
  ],
  webServer: {
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
