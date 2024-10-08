import { IDatabaseCreateDeviceData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 * Creates a new device.
 */
async function createDevice(data: IDatabaseCreateDeviceData): Promise<void> {
  await mainDB.write.insert(data).into("device");

  // to create the device data table
  await getDeviceConnection(data.id, data.type);
}

export default createDevice;
