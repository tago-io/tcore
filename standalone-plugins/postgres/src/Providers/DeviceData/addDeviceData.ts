import {
  IDatabaseDeviceDataCreate,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 * Adds a data item into a device.
 */
async function addDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  data: IDatabaseDeviceDataCreate[]
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);
  for (const item of data) {
    await client.write("data").insert(item);
  }
}

export default addDeviceData;
