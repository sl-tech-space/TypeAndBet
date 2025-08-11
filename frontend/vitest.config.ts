import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".next",
      "src/**/*.stories.{js,jsx,ts,tsx}",
      "src/**/*.config.{js,ts}",
    ],
    globals: true,
    typecheck: {
      tsconfig: "./tsconfig.json",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "src/__tests__/",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/index.ts",
        "**/*.stories.{js,jsx,ts,tsx}",
        "src/app/**", // App Routerページは統合テストで
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    // UI関連の設定
    ui: true,
    open: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
