const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "../build");

try {
  fs.rmSync(buildPath, { recursive: true });
} catch (ex) {
  //
}

console.log("Starting esbuild...");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: `${buildPath}/index.js`,
    target: ["node14"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "../"),
    minify: true,
    sourcemap: false
  })
  .catch(console.log);
