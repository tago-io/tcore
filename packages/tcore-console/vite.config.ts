import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "../../package.json" with { type: "json" };

const filename = fileURLToPath(import.meta.url);
const buildPath = join(dirname(filename), "./build");
const version = pkg.version;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: { icon: true },
      include: ["**/*.svg", "**/*.svg?react"],
      exclude: [],
    }),
    react(),
  ],
  base: "/console",
  build: {
    sourcemap: true,
    outDir: `${buildPath}/tcore-v${version}`,
  },
});
