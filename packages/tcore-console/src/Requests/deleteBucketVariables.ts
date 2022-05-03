import { Account } from "@tago-io/sdk";
import { TGenericID } from "@tago-io/tcore-sdk/types";

/**
 */
async function deleteBucketVariables(id: TGenericID, params: any): Promise<void> {
  const account = new Account({ token: "TMP_TOKEN" });
  await account.buckets.deleteVariable(id, params);
}

export default deleteBucketVariables;
