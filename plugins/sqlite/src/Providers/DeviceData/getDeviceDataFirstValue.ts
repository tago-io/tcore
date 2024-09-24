import { IDeviceData, IDatabaseGetDeviceDataQuery, TGenericID, TDeviceType } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves from a device the first data item that contains a value.
 */
async function getDeviceDataFirstValue(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.whereNotNull("value").orderBy("time", "ASC").limit(1);

  return finishBucketDataQuery(client, knexQuery, query);
}

export default getDeviceDataFirstValue;
