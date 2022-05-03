import {
  IDeviceTokenCreate,
  IDeviceTokenCreateResponse,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function createDeviceToken(
  deviceID: TGenericID,
  token: Omit<IDeviceTokenCreate, "token" | "created_at">
): Promise<IDeviceTokenCreateResponse> {
  const response = await axios.post("/device/token", {
    ...token,
    device: deviceID,
  });
  return response.data.result;
}

export default createDeviceToken;
