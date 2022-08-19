import { getStatus, exitSystem } from "./System";

describe("getStatus", () => {
  test("expect correct type", () => {
    const data = getStatus();
    expect(data).toBeInstanceOf(Object);
  });
});

describe("exitSystem", () => {
  test("catch incorrect paramater", () => {
    const data: any = "string";
    try {
      exitSystem(data);
    } catch (error) {
      expect(error).toBe("Expected number, received string");
    }
  });
});
