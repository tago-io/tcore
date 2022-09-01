import { runAnalysis } from "./AnalysisCodeExecution";

describe("runAnalysis", () => {
  test("assure correct paramater", () => {
    const data: any = {
      id: 0,
      data: 0,
    };
    try {
      runAnalysis(data.id, data.data);
    } catch (error) {
      expect(error).toBe("Expected string, recieved number");
    }
  });

  test("catch invalid id", () => {
    const data: any = {
      id: "0",
      data: 0,
    };
    try {
      runAnalysis(data.id, data.data);
    } catch (error) {
      expect(error).toBe("Invalid Analysis ID");
    }
  });
});
