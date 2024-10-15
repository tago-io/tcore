import { TGenericToken } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Deletes a device's token.
 */
async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  await mainDB.write.delete().from("device_token").where("token", token);
}

export default deleteDeviceToken;
