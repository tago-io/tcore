import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "../../package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const dirname_ = dirname(__filename);

const buildPath = join(dirname_, "./build");
const version = pkg.version;

console.log("buildPath", buildPath);
console.log("version", version);

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  base: "/console",
  build: {
    outDir: `${buildPath}/tcore-v${version}.js`,
    rollupOptions: {
      external: ["@tago-io/tcore-shared", "luxon"],
    },
  },
});
