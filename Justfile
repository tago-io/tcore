export TZ := "UTC"
TS_LOADER := " --import @swc-node/register/esm-register"
NODE_PARAMS := "--no-warnings " + TS_LOADER

run package file="main.ts" *node_args="":
  @node {{NODE_PARAMS}} {{node_args}} packages/{{package}}/{{file}}

linter:
  @npx @biomejs/biome check

build-console:
 @node {{NODE_PARAMS}} packages/tcore-console/esbuild/build.ts
