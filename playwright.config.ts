import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 2, // Reducido para evitar saturar la base de datos de Vercel (Timeouts)
  reporter: [
    ["html", { outputFolder: "tests/playwright-report", open: "never" }],
    ["list"],
    ["json", { outputFile: "tests/results.json" }],
  ],
  use: {
    baseURL: "https://facturadord.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30000, // Incrementado a 30s
    navigationTimeout: 60000, // Incrementado a 60s
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
