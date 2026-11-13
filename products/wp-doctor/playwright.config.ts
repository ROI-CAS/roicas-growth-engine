import { defineConfig } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= `${process.cwd()}/.cache/playwright`;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node --import tsx tests/fixture-server.ts",
    url: "http://127.0.0.1:4173/api/health/live",
    reuseExistingServer: false,
    timeout: 60000,
  },
  reporter: [["list"]],
});
