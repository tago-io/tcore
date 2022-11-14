jest.mock("fs");
jest.mock("fs/promises");
jest.mock("../Helpers.ts", () => ({
  getPackage: () => ({}),
}));

import fs from "fs/promises";

import process from "process";
import path from "path";
import { vol } from "memfs";

import * as pack from "./Pack";

beforeAll(() => {
  const filesystem = {
    "./README.md": "readme",
    "./index.js": "index.js",
  };

  vol.fromNestedJSON(filesystem, "/app");

  jest.spyOn(process, "cwd").mockReturnValue("/app");
});

// TODO: Add tests
// describe("Generate TCore file", () => {
//   it("should create .tcore as default", async () => {
//     console.log(await fs.readdir("/app"));
//     console.log(path.join(process.cwd(), "src"));
//     jest.spyOn(pack, "getFilesToPack").mockImplementation(async () => []);
//     jest.spyOn(pack, "compressProject").mockImplementation(async () => undefined);
//     expect(await pack.generateTCoreFile({ filename: "test", force: false, out: ".tcore", target: [] })).toBe({});
//   });
// });
