import inspectFormat from "../lib/inspectFormat";
import toTagoFormat, { IDeviceDataLatLng } from "../lib/toTagoFormat";

/**
 * Decode data from Tektelic
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.payloadMetaData) {
    return payload;
  }

  const serie = String(new Date().getTime());
  let toTago: IDeviceDataLatLng[] = [];

  if (payload.payloadMetaData) {
    delete payload.payloadMetaData.deviceMetaData;
    delete payload.payloadMetaData.applicationMetaData;
    delete payload.payloadMetaData.gatewayMetaDataList[0].id;
    delete payload.payloadMetaData.gatewayMetaDataList[0].name;
    payload.payloadMetaData.gatewayMetaDataList[0].gtw_id = payload.payloadMetaData.gatewayMetaDataList[0].mac;
    delete payload.payloadMetaData.gatewayMetaDataList[0].mac;
    payload.payloadMetaData.gatewayMetaDataList[0].gtw = {
      altitude: payload.payloadMetaData.gatewayMetaDataList[0].altitude,
      latitude: payload.payloadMetaData.gatewayMetaDataList[0].latitude,
      longitude: payload.payloadMetaData.gatewayMetaDataList[0].longitude,
    };
    delete payload.payloadMetaData.gatewayMetaDataList[0].altitude;
    delete payload.payloadMetaData.gatewayMetaDataList[0].latitude;
    delete payload.payloadMetaData.gatewayMetaDataList[0].longitude;
    // console.log(JSON.stringify(payload, null, 4));
    toTago = toTago.concat(inspectFormat(payload.payloadMetaData.gatewayMetaDataList[0], serie));
    delete payload.payloadMetaData.gatewayMetaDataList[0];
    toTago = toTago.concat(inspectFormat(payload.payloadMetaData, serie));
    delete payload.payloadMetaData;
  }
  // Parse the payload_fields. Go to inspectFormat function if you need to change something.
  if (payload.payload) {
    if (payload.payload.data) {
      payload.payload.payload = payload.payload.data;
      delete payload.payload.data;
    }
    if (payload.payload.payload_hex) {
      payload.payload.payload = payload.payload.payload_hex;
      delete payload.payload.payload_hex;
    }

    if (payload.payload.bytes) {
      payload.payload.payload = payload.payload.bytes;
      delete payload.payload.bytes;
    }

    if (payload.payload && payload.payload.payload && payload.payload.payload.includes("[")) {
      payload.payload.payload = Buffer.from(JSON.parse(payload.payload.payload)).toString("hex");
    }

    toTago = toTago.concat(toTagoFormat(payload.payload, serie));
  }
  toTago = toTago.filter((x) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0));

  return toTago;
}
