import { IDeviceParameterCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function setDeviceParams(
  deviceID: TGenericID,
  parameters: IDeviceParameterCreate[]
): Promise<void> {
  await axios.post(`/device/${deviceID}/params`, parameters);
}

export default setDeviceParams;
