import { IDeviceData } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store";

/**
 * Edits data from a device.
 */
async function editDeviceData(deviceID: string, data: IDeviceData) {
  await axios.put(`/device/${deviceID}/data`, data, { headers: { token: store.token } });
}

export default editDeviceData;
