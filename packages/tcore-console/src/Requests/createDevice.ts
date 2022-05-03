import { ICreateDeviceResponse, IDeviceCreate } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function createDevice(device: IDeviceCreate): Promise<ICreateDeviceResponse> {
  const response = await axios.post("/device", device);
  const { data } = response;
  return data.result;
}

export default createDevice;
