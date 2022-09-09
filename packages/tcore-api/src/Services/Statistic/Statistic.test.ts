import { addStatistic, getHourlyStatistics } from "./Statistic";

describe("addStatistic", () => {
  test("check inexistent plugin", async () => {
    const data = {
      input: "a",
    };
    try {
      await addStatistic(data as any);
    } catch (error) {
      expect((error as any).message).toContain("Database plugin not found");
    }
  });
});

describe("getHourlyStatistics", () => {
  test("check inexistent plugin", async () => {
    try {
      await getHourlyStatistics();
    } catch (error) {
      expect((error as any).message).toContain("Database plugin not found");
    }
  });
});
