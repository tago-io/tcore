import {
  IDeviceData,
  IDatabaseGetDeviceDataQuery,
  TGenericID,
  TDeviceType,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves the item with the lowest value in a device.
 */
async function getDeviceDataMin(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client
    .read("data")
    .whereNotNull("value")
    .where("type", "number")
    .orderBy("value", "ASC")
    .limit(1);

  return finishBucketDataQuery(client.read("data"), knexQuery, query);
}

export default getDeviceDataMin;
