import { ZodError } from "zod";
import { getTagKeys } from "./Tag";

describe("getTagKeys", () => {
  test("assure correct type", () => {
    const data = "string";
    const parsed = getTagKeys(data);
    expect(parsed).toBeInstanceOf(Array);
  });

  test("catch incorrect type", () => {
    const data: any = 0;
    try {
      getTagKeys(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.key[0]).toBe("Expected string, received number");
    }
  });
});
