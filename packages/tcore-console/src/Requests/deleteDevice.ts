import { Account } from "@tago-io/sdk";
import { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function deleteDevice(id: TGenericID): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.delete(id);
}

export default deleteDevice;
