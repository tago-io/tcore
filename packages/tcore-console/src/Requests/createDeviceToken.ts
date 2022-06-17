import { Account } from "@tago-io/sdk";
import { TokenData } from "@tago-io/sdk/out/common/common.types";
import {
  IDeviceTokenCreate,
  IDeviceTokenCreateResponse,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function createDeviceToken(
  deviceID: TGenericID,
  data: Omit<IDeviceTokenCreate, "token" | "created_at">
): Promise<IDeviceTokenCreateResponse> {
  const account = new Account({ token: store.token });
  const result = await account.devices.tokenCreate(deviceID, data as TokenData);
  return result as unknown as IDeviceTokenCreateResponse;
}

export default createDeviceToken;
