import { runAnalysis } from "./AnalysisCodeExecution";

describe("runAnalysis", () => {
  test("assure correct paramater", async () => {
    const data: any = {
      id: 0,
      data: 0,
    };
    try {
      await runAnalysis(data.id, data.data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });

  test("catch invalid id", async () => {
    const data: any = {
      id: "0",
      data: 0,
    };
    try {
      await runAnalysis(data.id, data.data);
    } catch (error) {
      expect((error as any).message).toBe("Database plugin not found");
    }
  });
});
