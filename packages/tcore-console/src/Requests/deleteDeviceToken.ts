import { TGenericToken } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  await axios.delete(`/device/token/${token}`);
}

export default deleteDeviceToken;
