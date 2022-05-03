import { Account } from "@tago-io/sdk";
import { TGenericID } from "@tago-io/tcore-sdk/types";

/**
 */
async function runAnalysis(id: TGenericID): Promise<void> {
  const account = new Account({ token: "TMP_TOKEN" });
  await account.analysis.run(id);
}

export default runAnalysis;
