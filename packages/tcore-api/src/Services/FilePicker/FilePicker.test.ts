import { getFileList } from "./FilePicker";

describe("getFileList", () => {
  test("assure correct paramater", async () => {
    const data = 0;
    try {
      await getFileList(data as any);
    } catch (error) {
      expect((error as any).message).toContain("Cannot read properties of undefined");
    }
  });
});
