import { IDatabaseDeviceDataCreate, TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
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
    const updateObject: any = { ...item };

    if (item.metadata) {
      updateObject.metadata = JSON.stringify(item.metadata) as any;
    }
    if (item.location) {
      updateObject.location = JSON.stringify(item.location) as any;
    }

    await client.insert(updateObject).into("data");
  }
}

export default addDeviceData;
