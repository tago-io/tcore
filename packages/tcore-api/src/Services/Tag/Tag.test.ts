import { getTagKeys } from "./Tag";

describe("getTagKeys", () => {
  test("check inexistent plugin", async () => {
    const data = "string";
    try {
      await getTagKeys(data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});
