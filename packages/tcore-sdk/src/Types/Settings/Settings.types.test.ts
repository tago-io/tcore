import { zSettings } from "./Settings.types";

test("requires `plugin_folder` property", async () => {
  const data = {};
  const fn = () => zSettings.parse(data);
  expect(fn).toThrow();
});

// test("parses object with `plugin_folder`", async () => {
//   const data: ISettings = { plugin_folder: "./" };
//   const parsed = await zSettings.parseAsync(data);
//   expect(parsed.database_plugin).toBeUndefined();
//   expect(parsed.port).toEqual(8888);
//   expect(parsed.settings_folder).toBeUndefined();
// });
