import { getFileList } from "./FilePicker";

describe("getFileList", () => {
  test("assure correct paramater", () => {
    const data = 0;
    try {
      getFileList(data as any);
    } catch (error) {
      expect(error).toBe("Expected string, recieved number");
    }
  });
});
