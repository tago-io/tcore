import { svgr } from "./svgr.ts";
import esbuild from "esbuild";
import { buildPath } from "./buildPath.ts";
import pkg from "../../../package.json" with { type: "json" };
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const dirname_ = dirname(__filename);

const version = pkg.version;

// import "./icon";
// import "./generateIndex";
//
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
    absWorkingDir: join(dirname_, "../"),
    // minify: !dev,
    minify: false,
    publicPath: "/console",
    sourcemap: dev,
    // watch: dev
    //   ? {
    //     onRebuild: () => {
    //       console.log("✔ Detected changes and rebuilt tcore-console");
    //     },
    //   }
    //   : null,
    external: ["path"],
    plugins: [svgr()],
    loader: {
      ".png": "file",
      ".gif": "file",
    },
  })
  .catch(() => process.exit(1));
