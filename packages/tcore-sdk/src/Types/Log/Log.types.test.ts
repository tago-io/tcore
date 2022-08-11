import { ZodError } from "zod";
import { zLogCreate, zLogList } from "./Log.types";

describe("zLogCreate", () => {
  test("parses simple object", () => {
    const data = {
      timestamp: new Date(),
      message: "message",
      error: true,
    };
    const parsed = zLogCreate.parse(data);
    expect(parsed.message).toEqual("message");
  });

  test("assure correct type", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
      error: "true",
    };
    try {
      zLogCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.error[0]).toBe("Expected boolean, received string");
    }
  });

  test("date as null", () => {
    const data = {
      timestamp: null,
      message: "message",
      error: true,
    };
    const parsed = zLogCreate.parse(data);
    expect(parsed.timestamp).toBeNull;
  });

  test("fail if required field is missing", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
    };
    try {
      zLogCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.error[0]).toBe("Required");
    }
  });
});

describe("zLogList", () => {
  test("parses simple object", () => {
    const data = [
      {
        timestamp: new Date(),
        message: "message",
        error: true,
      },
    ];
    const parsed = zLogList.parse(data);
    expect(parsed[0].message).toEqual("message");
  });

  test("assure it is an array", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
      error: true,
    };
    try {
      zLogList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({});
    }
  });

  test("check empty array", () => {
    const data = [];
    try {
      zLogList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toBe("Expected array, received object");
    }
  });
});
