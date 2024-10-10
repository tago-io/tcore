import svgr from "./svgr.js";
import * as esbuild from "esbuild";
import path from "node:path";
import buildPath from "./buildPath.js";
import { version } from "../../../package.json";

import "./icon.js";
import "./generateIndex.js";

const dev = process.argv.includes("--watch");

console.log("Starting esbuild...");

esbuild
  .build({
    entryPoints: ["./src/App.tsx"],
    bundle: true,
    charset: "utf8",
    outfile: `${buildPath}/tcore-v${version}.js`,
    target: ["chrome58", "safari11"],
    inject: ["./react-shim.js"],
    absWorkingDir: path.join(__dirname, "../"),
    minify: !dev,
    publicPath: "/console",
    sourcemap: dev,
    watch: dev ? {
      onRebuild: () => {
        console.log("✔ Detected changes and rebuilt tcore-console");
      }
    } : null,
    external: ["path"],
    plugins: [svgr()],
    loader: {
      ".png": "file",
      ".gif": "file",
    },
  })
  .catch(() => process.exit(1));
