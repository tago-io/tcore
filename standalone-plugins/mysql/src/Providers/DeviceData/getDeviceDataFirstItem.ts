import {
  IDeviceData,
  IDatabaseGetDeviceDataQuery,
  TGenericID,
  TDeviceType,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves from a device the first data item sorted by descending `time`.
 */
async function getDeviceDataFirstItem(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.read("data").orderBy("time", "ASC").limit(1);

  return finishBucketDataQuery(client.read("data"), knexQuery, query);
}

export default getDeviceDataFirstItem;
