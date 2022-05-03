import { Account } from "@tago-io/sdk";
import { TGenericID } from "@tago-io/tcore-sdk/types";

/**
 */
async function getDeviceDataAmount(id: TGenericID) {
  const account = new Account({ token: "TMP_TOKEN" });
  const amount = await account.buckets.amount(id);
  return amount;
}

export default getDeviceDataAmount;
