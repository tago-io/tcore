import { getStatus } from "./System";

describe("getStatus", () => {
  test("expect correct type", async () => {
    const data = await getStatus();
    expect(data).toBeInstanceOf(Object);
  });
});
