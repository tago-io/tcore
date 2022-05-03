import { IDeviceEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function editDevice(id: TGenericID, device: IDeviceEdit): Promise<void> {
  await axios.put(`/device/${id}`, device);
}

export default editDevice;
