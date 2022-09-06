//import { ZodError } from "zod";
import { validateAnalysisID, addAnalysisLog, getAnalysisLogs, getAnalysisList } from "./Analysis";

describe("validateAnalysisID", () => {
  test("check invalid id", () => {
    const data = " ";
    const parsed = validateAnalysisID(data);
    expect(parsed).toBe("Invalid Analysis ID");
  });
});

describe("addAnalysisLog", () => {
  test("assure correct type", () => {
    const data1 = "string";
    const data2 = {
      timestamp: new Date(),
      message: "string",
      error: false,
    };
    const parsed = addAnalysisLog(data1, data2);
    expect(parsed).toBeInstanceOf(Array);
  });
});

describe("getAnalysisLogs", () => {
  test("expect correct type", () => {
    const data = " ";
    const parsed = getAnalysisLogs(data);
    expect(parsed).toBeInstanceOf(Array);
  });
});

describe("getAnalysisList", () => {
  test("expect correct type", () => {
    const data = {};
    const parsed = getAnalysisList(data);
    expect(parsed).toBeInstanceOf(Array);
  });
});
