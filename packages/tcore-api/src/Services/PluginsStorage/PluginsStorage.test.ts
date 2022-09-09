import {
  getPluginStorageItem,
  setPluginStorageItem,
  deletePluginStorageItem,
  getAllPluginStorageItems,
} from "./PluginsStorage";

describe("getPluginStorageItem", () => {
  test("assure invalid connection", async () => {
    const data = {
      pluginid: 0,
      key: 0,
    };
    try {
      await getPluginStorageItem(data.pluginid as any, data.key as any);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});

describe("setPluginStorageItem", () => {
  test("assure correct type", async () => {
    const data = {
      pluginid: 0,
      key: 0,
      value: 0,
    };
    try {
      await setPluginStorageItem(data.pluginid as any, data.key as any, data.value);
    } catch (error) {
      expect((error as any).message).toContain("Expected string, received number");
    }
  });
});

describe("deletePluginStorageItem", () => {
  test("assure invalid connection", async () => {
    const data = {
      pluginid: 0,
      key: 0,
    };
    try {
      await deletePluginStorageItem(data.pluginid as any, data.key as any);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});

describe("getAllPluginStorageItems", () => {
  test("assure invalid connection", async () => {
    const data = 0;
    try {
      await getAllPluginStorageItems(data as any);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});
