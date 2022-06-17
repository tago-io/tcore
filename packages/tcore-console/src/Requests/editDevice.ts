import { Account } from "@tago-io/sdk";
import { DeviceInfo } from "@tago-io/sdk/out/modules/Account/devices.types";
import { IDeviceEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function editDevice(id: TGenericID, data: IDeviceEdit): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.edit(id, data as Partial<DeviceInfo>);
}

export default editDevice;
