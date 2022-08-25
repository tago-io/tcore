import { addStatistic, getHourlyStatistics } from "./Statistic";

describe("addStatistic", () => {
  test("assure correct type", () => {
    const data = {
      input: "a",
    };
    try {
      addStatistic(data as any);
    } catch (error) {
      expect(error).toBe("Expected number, received string");
    }
  });
});

describe("getHourlyStatistics", () => {
  test("expect correct type", () => {
    const parsed = getHourlyStatistics();
    expect(parsed).toBeInstanceOf(Object);
  });
});
