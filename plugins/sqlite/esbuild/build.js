const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "../build");
const migrations = fs.readdirSync(path.join(__dirname, "..", "src", "Migrations"));

/**
 * Copies the node_modules sqlite binary to the binary folder.
 */
function copySqliteBinary() {
  const bindingsPath = path.join(__dirname, "..", "node_modules", "sqlite3", "lib", "binding");
  const bindings = fs.readdirSync(bindingsPath);
  const firstBinding = path.join(bindingsPath, bindings[0], "node_sqlite3.node");
  fs.copyFileSync(firstBinding, path.join(`${buildPath}/Binary/node_sqlite3.node`));
}

/**
 * Builds it.
 */
async function build() {
  await fs.promises.rm(buildPath, { recursive: true }).catch(() => null);
  await fs.promises.mkdir(`${buildPath}/Migrations`, { recursive: true }).catch(() => null);
  await fs.promises.mkdir(`${buildPath}/Binary`).catch(() => null);
  copySqliteBinary();

  // builds the migration folder
  await esbuild.build({
    entryPoints: migrations.map((x) => `./src/Migrations/${x}`),
    bundle: true,
    outdir: `${buildPath}/Migrations`,
    target: ["node16"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "../"),
    minify: true,
    sourcemap: false,
    watch: false
  });

  // builds the rest of the index
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: `${buildPath}/index.js`,
    target: ["node16"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "../"),
    minify: true,
    sourcemap: false,
    watch: false
  });
}

build();
