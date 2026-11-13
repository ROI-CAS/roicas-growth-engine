import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  {
    ignores: [
      "dist/**",
      "**/node_modules/**",
      "**/.cache/**",
      "**/.wrangler/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
      },
    },
  },
  {
    files: ["**/*.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "error" },
  },
);
