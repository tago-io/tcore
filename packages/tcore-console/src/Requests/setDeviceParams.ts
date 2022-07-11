import { Account } from "@tago-io/sdk";
import { IDeviceParameterCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function setDeviceParams(
  deviceID: TGenericID,
  data: IDeviceParameterCreate[]
): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.paramSet(deviceID, data as any);
}

export default setDeviceParams;
