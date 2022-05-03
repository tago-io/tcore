import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function deleteDevice(id: TGenericID): Promise<void> {
  await axios.delete(`/device/${id}`);
}

export default deleteDevice;
