import { Account } from "@tago-io/sdk";
import { TGenericToken } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.tokenDelete(token);
}

export default deleteDeviceToken;
