import { writeFile, createFolder, deleteFileOrFolder, readFile, getFileURI, getFolderURI } from "./File";

describe("writeFile", () => {
  test("assure correct paramater", async () => {
    const data = {
      pluginID: 0,
      filename: 0,
      data: 0,
    };
    try {
      await writeFile(data.pluginID as any, data.filename as any, data.data as any);
    } catch (error) {
      expect((error as any).message).toContain("Received type number");
    }
  });
});

describe("createFolder", () => {
  test("assure correct paramater", async () => {
    const data = {
      pluginID: 0,
      folderPath: 0,
    };
    try {
      await createFolder(data.pluginID as any, data.folderPath as any);
    } catch (error) {
      expect((error as any).message).toContain("Received type number");
    }
  });
});

describe("deleteFileOrFolder", () => {
  test("assure correct paramater", async () => {
    const data = {
      pluginID: 0,
      fileName: 0,
    };
    try {
      await deleteFileOrFolder(data.pluginID as any, data.fileName as any);
    } catch (error) {
      expect((error as any).message).toContain("Received type number");
    }
  });
});

describe("readFile", () => {
  test("assure correct paramater", async () => {
    const data = {
      pluginID: 0,
      folderPath: 0,
    };
    try {
      await readFile(data.pluginID as any, data.folderPath as any);
    } catch (error) {
      expect((error as any).message).toContain("Received type number");
    }
  });

  test("check inexistent file", async () => {
    const data = {
      pluginID: " ",
      folderPath: " ",
    };
    try {
      await readFile(data.pluginID, data.folderPath);
    } catch (error) {
      expect((error as any).message).toContain("no such file or directory");
    }
  });
});

describe("getFileURI", () => {
  test("expect correct type", async () => {
    const data = {
      pluginID: " ",
      filename: " ",
    };
    const response = await getFileURI(data.pluginID, data.filename);
    expect(typeof response).toBe("string");
  });
});

describe("getFolderURI", () => {
  test("expect correct type", async () => {
    const data = " ";
    const feedback = await getFolderURI(data);
    expect(typeof feedback).toBe("string");
  });
});
