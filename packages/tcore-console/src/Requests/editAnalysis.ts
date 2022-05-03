import { IAnalysisEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function editAnalysis(id: TGenericID, analysis: IAnalysisEdit): Promise<void> {
  await axios.put(`/analysis/${id}`, analysis);
}

export default editAnalysis;
