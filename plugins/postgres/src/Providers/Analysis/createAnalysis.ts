import { IDatabaseCreateAnalysisData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Creates a new analysis.
 */
async function createAnalysis(
  data: IDatabaseCreateAnalysisData
): Promise<void> {
  await mainDB.write.insert(data).into("analysis");
}

export default createAnalysis;
