import { convertDateToISO, parseRelativeDate } from "./parseRelativeDate";

describe("convertDateToISO", () => {
  test("convert simple date", () => {
    const data = convertDateToISO("01/01/01");
    console.log(data);
    expect(typeof data).toBe("string");
  });
});

describe("parseRelativeDate", () => {
  test("simple parse", () => {
    /*
    const data = parseRelativeDate("01-01-2100", true);
    expect(data).toBeInstanceOf(String);
    */
  });

  test("check invalid date", () => {
    try {
      parseRelativeDate(" ", " ");
    } catch (e: any) {
      expect(e.message).toBe("Invalid date");
    }
  });
});
