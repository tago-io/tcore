import { getSummary } from "./Summary";

describe("getSummary", () => {
  test("expect correct type", () => {
    const parsed = getSummary();
    expect(parsed).toBeInstanceOf(Object);
  });
});
