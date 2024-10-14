import { transform } from "@svgr/core";
import fs from "fs";

const svgr = (options = {}) => ({
  name: "svgr",
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const svg = await fs.promises.readFile(args.path, "utf8");
      const componentName = args.path.split("/").pop().replace(".svg", "");
      const contents = await transform(svg, { plugins: ['@svgr/plugin-svgo'], ...options, icon: true }, { componentName });
      return {
        contents,
        loader: "jsx",
      };
    });
  },
});

export { svgr };
