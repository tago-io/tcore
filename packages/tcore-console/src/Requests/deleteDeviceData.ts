import { IDeviceDataQuery } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 * Deletes data from a device.
 */
async function deleteDeviceData(deviceID: string, params: IDeviceDataQuery) {
  await axios.delete(`/device/${deviceID}/data`, { params });
}

export default deleteDeviceData;
