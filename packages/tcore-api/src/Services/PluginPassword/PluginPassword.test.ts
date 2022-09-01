import { encryptPluginConfigPassword, decryptPluginConfigPassword } from "./PluginPassword";

describe("encryptPluginConfigPassword", () => {
  test("assure correct paramater", () => {
    const data = 0;
    try {
      encryptPluginConfigPassword(data as any);
    } catch (error) {
      expect(error).toBe("Expected string, recieved number");
    }
  });
  test("assure correct return", () => {
    const data = "string";
    const parsed = encryptPluginConfigPassword(data);
    expect(parsed).toBeInstanceOf(String);
  });
});

describe("decryptPluginConfigPassword", () => {
  test("assure correct paramater", () => {
    const data = 0;
    try {
      decryptPluginConfigPassword(data as any);
    } catch (error) {
      expect(error).toBe("Expected string, recieved number");
    }
  });
  test("assure correct return", () => {
    const data = "string";
    const parsed = decryptPluginConfigPassword(data);
    expect(parsed).toBeInstanceOf(String);
  });
});
