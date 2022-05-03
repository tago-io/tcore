import { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import { Account } from "@tago-io/sdk";

/**
 * Retrieves all information of a single device.
 */
async function getDeviceInfo(id: TGenericID): Promise<IDevice> {
  const account = new Account({ token: "TMP_TOKEN" });
  const device = await account.devices.info(id);
  return device as any as IDevice;
}

export default getDeviceInfo;
