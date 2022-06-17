import { IDeviceDataQuery } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store";

/**
 * Deletes data from a device.
 */
async function deleteDeviceData(deviceID: string, params: IDeviceDataQuery) {
  await axios.delete(`/device/${deviceID}/data`, { params, headers: { token: store.token } });
}

export default deleteDeviceData;
