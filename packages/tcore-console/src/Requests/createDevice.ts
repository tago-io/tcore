import { Account } from "@tago-io/sdk";
import { DeviceCreateInfo } from "@tago-io/sdk/out/modules/Account/devices.types";
import { ICreateDeviceResponse, IDeviceCreate } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function createDevice(data: IDeviceCreate): Promise<ICreateDeviceResponse> {
  const account = new Account({ token: store.token });
  const result = await account.devices.create(data as DeviceCreateInfo);
  return result;
}

export default createDevice;
