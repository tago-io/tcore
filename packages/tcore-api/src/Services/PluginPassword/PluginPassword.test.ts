import { encryptPluginConfigPassword, decryptPluginConfigPassword } from "./PluginPassword";

describe("encryptPluginConfigPassword", () => {
  test("assure correct paramater", () => {
    const data = 0;
    try {
      encryptPluginConfigPassword(data as any);
    } catch (error) {
      expect((error as any).message).toContain("Received type number");
    }
  });
  test("assure correct return", () => {
    const data = "string";
    const parsed = encryptPluginConfigPassword(data);
    expect(typeof parsed).toBe("string");
  });
});

describe("decryptPluginConfigPassword", () => {
  test("assure correct paramater", () => {
    const data = 0;
    try {
      decryptPluginConfigPassword(data as any);
    } catch (error) {
      expect((error as any).message).toContain("encrypted.split is not a function");
    }
  });
  test("assure correct return", () => {
    const data = "string";
    try {
      decryptPluginConfigPassword(data);
    } catch (error) {
      expect((error as any).message).toContain("Invalid initialization vector");
    }
  });
});
