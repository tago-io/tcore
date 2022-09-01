import { runPayloadParser } from "./PayloadParserCodeExecution";

describe("runPayloadParser", () => {
  test("assure correct paramater", () => {
    const data = {
      active: true,
    };
    try {
      runPayloadParser(data as any);
    } catch (error) {
      expect(error).toBe("required");
    }
  });
});
