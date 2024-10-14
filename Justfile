export TZ := "UTC"
TS_LOADER := " --import @swc-node/register/esm-register"
NODE_PARAMS := "--no-warnings " + TS_LOADER

run package file="main.ts" *node_args="":
  @node {{NODE_PARAMS}} {{node_args}} packages/{{package}}/{{file}}

linter:
  @npx @biomejs/biome check

build-console:
  just _pre-build
  @rm -rf build/console
  @cd packages/tcore-console && npm run build



# The process.env is not working on Vite Build
# This is a workaround to make it work
file_path := "./node_modules/@tago-io/sdk/out/regions.js"
_pre-build:
  @sed -i'' -e 's/ process\.env\.TAGOIO_API/ window.process.env.TAGOIO_API/g' "{{file_path}}"
  @sed -i'' -e 's/ process\.env\.TAGOIO_REALTIME/ window.process.env.TAGOIO_REALTIME/g' "{{file_path}}"
  @echo "SDK patched"
