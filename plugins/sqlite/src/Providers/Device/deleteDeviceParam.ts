import { TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex";

/**
 * Deletes a device's param.
 */
async function deleteDeviceParam(deviceID: TGenericID): Promise<void> {
  await knexClient.delete().from("device_params").where("id", deviceID);
}

export default deleteDeviceParam;
