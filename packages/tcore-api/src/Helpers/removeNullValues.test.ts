import removeNullValues from "./removeNullValues";

describe("Remove Null Values", () => {
  it("should remove null values from an object", () => {
    const value = { variable: "temperature", value: 12, group: null };
    const result = removeNullValues(value);
    expect(result).toStrictEqual({ variable: "temperature", value: 12 });
  });
  it("should remove null values from an array of objects"),
    () => {
      const value = [
        { variable: "temperature", value: 15, group: null },
        { variable: "humidity", value: null },
      ];
      const result = removeNullValues(value);
      expect(result).toStrictEqual([{ variable: "temperature", value: 15 }, { variable: "humidity" }]);
    };
});
