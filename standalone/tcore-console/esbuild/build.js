/* eslint-disable @typescript-eslint/no-var-requires */
const svgr = require("./svgr");
const esbuild = require("esbuild");
const path = require("path");
const buildPath = require("./buildPath");
const version = require("../../../package.json").version;

require("./icon");
require("./generateIndex");

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
    watch: dev
      ? {
          onRebuild: () => {
            console.log("✔ Detected changes and rebuilt tcore-console");
          },
        }
      : null,
    external: ["path"],
    plugins: [svgr()],
    loader: {
      ".png": "file",
      ".gif": "file",
    },
  })
  .catch(() => process.exit(1));
