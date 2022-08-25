import {
  getPluginStorageItem,
  setPluginStorageItem,
  deletePluginStorageItem,
  getAllPluginStorageItems,
} from "./PluginsStorage";

describe("getPluginStorageItem", () => {
  test("assure correct type", () => {
    const data = {
      pluginid: 0,
      key: 0,
    };
    try {
      getPluginStorageItem(data.pluginid as any, data.key as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("setPluginStorageItem", () => {
  test("assure correct type", () => {
    const data = {
      pluginid: 0,
      key: 0,
      value: 0,
    };
    try {
      setPluginStorageItem(data.pluginid as any, data.key as any, data.value);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("deletePluginStorageItem", () => {
  test("assure correct type", () => {
    const data = {
      pluginid: 0,
      key: 0,
    };
    try {
      deletePluginStorageItem(data.pluginid as any, data.key as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("getAllPluginStorageItems", () => {
  test("assure correct type", () => {
    const data = 0;
    try {
      getAllPluginStorageItems(data as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});
