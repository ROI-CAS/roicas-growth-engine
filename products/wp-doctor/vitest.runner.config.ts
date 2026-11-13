import { defineConfig } from "vitest/config";
process.env.PLAYWRIGHT_BROWSERS_PATH ??= `${process.cwd()}/.cache/playwright`;
export default defineConfig({
  test: {
    include: ["tests/runner-browser.test.ts"],
    testTimeout: 100000,
    hookTimeout: 30000,
    maxWorkers: 1,
  },
});
