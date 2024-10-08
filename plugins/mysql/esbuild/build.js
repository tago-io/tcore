/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const path = require("path");
const buildPath = path.join(__dirname, "../build");

console.log("Starting esbuild...");

const dev = process.argv.includes("--watch");

esbuild
  .build({
    entryPoints: ["../src/index.ts"],
    bundle: true,
    outfile: `${buildPath}/index.js`,
    target: ["node14"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "./"),
    minify: false,
    sourcemap: false,
    watch: dev ? { onRebuild: () => console.log("Rebuilding...") } : false,
  })
.catch(console.log);
