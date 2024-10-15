import toTagoFormat, { IDeviceDataLatLng } from "../lib/toTagoFormat";
import { IPayloadParamsActility } from "./uplink";

/**
 * Decode data from Actility
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(
  payload: Partial<IPayloadParamsActility["DevEUI_uplink"]> & { payload?: string }
): Promise<IDeviceDataLatLng[]> {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.DevEUI) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return payload as any;
  }

  const serie = String(new Date().getTime());
  if (payload.payload_hex) {
    payload.payload = payload.payload_hex;
    delete payload.payload_hex;
  }
  delete payload.CustomerData;
  delete payload.CustomerID;
  delete payload.Lrrs;
  delete payload.DevAddr;
  delete payload.AppSKey;
  delete payload.DynamicClass;
  delete payload.InstantPER;
  delete payload.MeanPER;

  let result = toTagoFormat(payload, serie);
  result = result.filter((x) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0));

  return result;
}
