const esbuild = require("esbuild");
const path = require("path");
const buildPath = path.join(__dirname, "../build");

const dev = process.argv.includes("--watch");

console.log("Starting esbuild...");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: `${buildPath}/index.js`,
    target: ["node16"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "../"),
    minify: !dev,
    sourcemap: dev,
    watch: dev ? { onRebuild: () => console.log("Rebuilding...") } : false,
  })
  .catch(console.log);
