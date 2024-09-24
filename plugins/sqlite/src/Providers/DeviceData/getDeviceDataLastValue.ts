import { IDeviceData, IDatabaseGetDeviceDataQuery, TGenericID, TDeviceType } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves the last value of a variable from a device.
 */
async function getDeviceDataLastValue(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.whereNotNull("value").orderBy("time", "DESC").limit(1);

  return finishBucketDataQuery(client, knexQuery, query);
}

export default getDeviceDataLastValue;
