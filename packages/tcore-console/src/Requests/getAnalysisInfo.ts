import { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { Account } from "@tago-io/sdk";

/**
 * Retrieves all information of a single analysis.
 */
async function getAnalysisInfo(id: TGenericID): Promise<IAnalysis> {
  const account = new Account({ token: "TMP_TOKEN" });
  const analysis = await account.analysis.info(id);
  return analysis as any as IAnalysis;
}

export default getAnalysisInfo;
