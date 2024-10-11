export TZ := "UTC"
TS_LOADER := " --import @swc-node/register/esm-register"
NODE_PARAMS := "--no-warnings " + TS_LOADER

run package file="main.ts" *node_args="":
  @node {{NODE_PARAMS}} {{node_args}} packages/{{package}}/{{file}}

build-plugins:
  #!/usr/bin/env sh
  for dir in plugins/*; do
    if [ -d "$dir" ]; then
      echo "Processing $dir..."
      cd "$dir" || exit
      npm install
      npm run build
      cd - || exit
    fi
  done
