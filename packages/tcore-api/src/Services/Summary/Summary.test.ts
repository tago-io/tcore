import { getSummary } from "./Summary";

describe("getSummary", () => {
  test("check inexistent plugin", async () => {
    try {
      await getSummary();
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});
