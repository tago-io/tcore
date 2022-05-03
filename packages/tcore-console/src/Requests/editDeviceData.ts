import { IDeviceData } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 * Edits data from a device.
 */
async function editDeviceData(deviceID: string, data: IDeviceData) {
  await axios.put(`/device/${deviceID}/data`, data);
}

export default editDeviceData;
