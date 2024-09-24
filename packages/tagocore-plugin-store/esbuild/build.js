const svgr = require("./svgr");
const esbuild = require("esbuild");
const fs = require("fs");
const trimTCoreCodePlugin = require("./trim-tcore-plugin");

const dev = process.argv.includes("--watch");

/**
 * Builds the front-end bundle.
 */
async function buildFront() {
  await esbuild.build({
    entryPoints: ["./src/front/index.tsx"],
    bundle: true,
    charset: "utf8",
    outfile: `./build/front/index.js`,
    target: ["chrome58", "safari11"],
    inject: ["./esbuild/react-shim.js", "./esbuild/dirname-shim.js"],
    minify: !dev,
    publicPath: "/pages/pluginstore",
    sourcemap: dev,
    external: ["path"],
    plugins: [svgr()]
  });
}

/**
 * Builds the back-end bundle.
 */
 async function buildBack() {
  await esbuild.build({
    entryPoints: ["./src/back/index.ts"],
    bundle: true,
    outfile: `./build/back/index.js`,
    target: ["node16"],
    platform: 'node',
    minify: !dev,
    sourcemap: dev,
  });
}

/**
 * Builds the cli bundle.
 */
 async function buildCli() {
  await esbuild.build({
    entryPoints: ["./src/cli/index.ts"],
    bundle: true,
    outfile: `./build/cli/index.js`,
    target: ["node16"],
    platform: 'node',
    minify: !dev,
    sourcemap: dev,
    plugins: [trimTCoreCodePlugin]
  });
}

/**
 * Builds the front-end html.
 */
async function generateHTML() {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="root"></div>
      <script src="/pages/pluginstore/index.js"></script>
    </body>
    </html>
  `;

  fs.writeFileSync(`./build/front/index.html`, template, { encoding: "utf-8" });
}

/**
 * Builds all the modules.
 */
async function build() {
  await fs.promises.rm("./build", { recursive: true }).catch(() => null);
  await Promise.all([
    await buildFront(),
    await buildBack(),
    await buildCli(),
    await generateHTML(),
  ]);
}

build();
