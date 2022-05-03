import { IAnalysisCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function createAnalysis(
  analysis: Omit<IAnalysisCreate, "id" | "created_at">
): Promise<TGenericID> {
  const response = await axios.post("/analysis", analysis);
  const { data } = response;
  return data.result;
}

export default createAnalysis;
