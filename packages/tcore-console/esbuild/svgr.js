import svgr from "@svgr/core";
import fs from "node:fs";

export default (options = {}) => ({
  name: "svgr",
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const svg = await fs.promises.readFile(args.path, "utf8");
      const contents = await svgr(svg, { ...options }, { filePath: args.path });
      return {
        contents,
        loader: "jsx",
      };
    });
  },
});
