import {
  writeFile,
  createFolder,
  deleteFileOrFolder,
  readFile,
  doesFileOrFolderExist,
  getFileURI,
  getFolderURI,
} from "./File";

describe("writeFile", () => {
  test("assure correct paramater", () => {
    const data = {
      pluginID: 0,
      filename: 0,
      data: 0,
    };
    try {
      writeFile(data.pluginID as any, data.filename as any, data.data as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("createFolder", () => {
  test("assure correct paramater", () => {
    const data = {
      pluginID: 0,
      folderPath: 0,
    };
    try {
      createFolder(data.pluginID as any, data.folderPath as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("deleteFileOrFolder", () => {
  test("assure correct paramater", () => {
    const data = {
      pluginID: 0,
      fileName: 0,
    };
    try {
      deleteFileOrFolder(data.pluginID as any, data.fileName as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("readFile", () => {
  test("assure correct paramater", () => {
    const data = {
      pluginID: 0,
      folderPath: 0,
    };
    try {
      readFile(data.pluginID as any, data.folderPath as any);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });

  test("assure correct return", () => {
    const data = {
      pluginID: " ",
      folderPath: " ",
    };
    const feedback = readFile(data.pluginID, data.folderPath);
    expect(feedback).toBeInstanceOf(String);
  });
});

describe("doesFileOrFolderExist", () => {
  test("expect inexistent file", () => {
    const data = {
      pluginID: " ",
      filename: " ",
    };
    const feedback = doesFileOrFolderExist(data.pluginID, data.filename);
    expect(feedback).toBeFalsy;
  });
});

describe("getFileURI", () => {
  test("expect correct type", () => {
    const data = {
      pluginID: " ",
      filename: " ",
    };
    const feedback = getFileURI(data.pluginID, data.filename);
    expect(feedback).toBeInstanceOf(String);
  });
});

describe("getFolderURI", () => {
  test("expect correct type", () => {
    const data = " ";
    const feedback = getFolderURI(data);
    expect(feedback).toBeInstanceOf(String);
  });
});
