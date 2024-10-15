import {
  TDeviceType,
  TGenericID,
  IDatabaseDeviceDataEdit,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 * Edits a device data point.
 */
async function editDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  data: IDatabaseDeviceDataEdit[]
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);

  for (const item of data) {
    const query = client.write("data").update(item).where("id", item.id);

    await query;
  }
}

export default editDeviceData;
