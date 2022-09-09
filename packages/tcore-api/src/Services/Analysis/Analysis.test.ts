//import { ZodError } from "zod";
import { validateAnalysisID, addAnalysisLog, getAnalysisLogs, getAnalysisList } from "./Analysis";

describe("validateAnalysisID", () => {
  test("check invalid id", async () => {
    const data = " ";
    try {
      await validateAnalysisID(data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});

describe("addAnalysisLog", () => {
  test("assure invalid connection", async () => {
    const data1 = "string";
    const data2 = {
      timestamp: new Date(),
      message: "string",
      error: false,
    };
    try {
      await addAnalysisLog(data1, data2);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});

describe("getAnalysisLogs", () => {
  test("assure invalid connection", async () => {
    const data = " ";
    try {
      await getAnalysisLogs(data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});

describe("getAnalysisList", () => {
  test("expect correct type", async () => {
    const data = {};
    try {
      await getAnalysisList(data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});
