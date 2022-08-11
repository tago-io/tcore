import removeNullValues from "./removeNullValues";

describe("removeNullValues", () => {
  test("process simple object", () => {
    const data = { key: "value" };
    const process = removeNullValues({ key: "value" });
    expect(process).toEqual(data);
  });

  test("removes null value", () => {
    const data = { key: null };
    const process = removeNullValues(data);
    expect(process).toBeInstanceOf(Object);
  });

  test("removes undefined value", () => {
    const data = { key: undefined };
    const process = removeNullValues(data);
    expect(process).toBeInstanceOf(Object);
  });
});
