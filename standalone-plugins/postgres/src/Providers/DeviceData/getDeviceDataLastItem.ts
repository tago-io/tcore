import {
  IDeviceData,
  IDatabaseGetDeviceDataQuery,
  TGenericID,
  TDeviceType,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves from a device the last data item sorted by descending `time`.
 */
async function getDeviceDataLastItem(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.read("data").orderBy("time", "DESC").limit(1);

  return finishBucketDataQuery(client.read("data"), knexQuery, query);
}

export default getDeviceDataLastItem;
