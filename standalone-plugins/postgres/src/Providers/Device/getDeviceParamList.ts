import { TGenericID, IDeviceParameterList } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Gets all the parameters of a device.
 */
async function getDeviceParamList(
  deviceID: TGenericID,
  sentStatus?: boolean
): Promise<IDeviceParameterList> {
  const query = mainDB.write
    .select()
    .select("*")
    .from("device_params")
    .where("device_id", deviceID);

  if (sentStatus !== undefined) {
    query.where("sent", sentStatus ? true : false);
  }

  const response = await query;
  return response;
}

export default getDeviceParamList;
