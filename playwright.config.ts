import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local manually to avoid TS compilation issues during next build
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const firstEqual = trimmed.indexOf("=");
      if (firstEqual !== -1) {
        const key = trimmed.substring(0, firstEqual).trim();
        let val = trimmed.substring(firstEqual + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

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
