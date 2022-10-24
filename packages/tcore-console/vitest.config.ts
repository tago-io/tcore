/* eslint-disable import/no-unresolved */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";
import { viteRequire } from "vite-require";

export default defineConfig({
  plugins: [react(), viteRequire()],
  test: {
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["build/*", "build-tsc/*", "node_module/*"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./utils/setup-jest.tsx"],
  },
});
