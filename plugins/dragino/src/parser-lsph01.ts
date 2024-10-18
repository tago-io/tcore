import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";

/**
 * @param bytes
 * @returns
 */
function Decoder(bytes: Buffer) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  let value = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
  const batV = value / 1000;

  value = (bytes[2] << 8) | bytes[3];
  if (bytes[2] & 0x80) {
    value |= 0xffff0000;
  }
  const tempcDs18b20 = (value / 10).toFixed(2);

  value = (bytes[4] << 8) | bytes[5];
  const ph1Soil = (value / 100).toFixed(2);

  value = (bytes[6] << 8) | bytes[7];
  let tempSoil = 0 as unknown as string;
  if ((value & 0x8000) >> 15 === 0) tempSoil = (value / 10).toFixed(2);
  else if ((value & 0x8000) >> 15 === 1)
    tempSoil = ((value - 0xffff) / 10).toFixed(2);

  const iFlag = bytes[8];
  const mesType = bytes[10];
  return [
    { variable: "bat_v", value: batV, unit: "v" },
    { variable: "tempc_ds18b20", value: tempcDs18b20, unit: "°c" },
    { variable: "ph1_soil", value: ph1Soil, unit: "ph" },
    { variable: "temp_soil", value: tempSoil, unit: "°c" },
    { variable: "interrupt_flag", value: iFlag },
    { variable: "message_type", value: mesType },
  ];
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLSPH01(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payloadRaw = payload.find(
    (x) =>
      x.variable === "payload_raw" ||
      x.variable === "payload" ||
      x.variable === "data",
  );

  if (payloadRaw) {
    try {
      // Convert the data from Hex to Javascript Buffer.
      const buffer = Buffer.from(String(payloadRaw.value), "hex");
      const serie = new Date().getTime();
      const payloadAux = Decoder(buffer);
      payload = payload.concat(payloadAux.map((x) => ({ ...x, serie })));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Print the error to the Live Inspector.
      console.error(e);
      // Return the variable parse_error for debugging.
      payload = [{ variable: "parse_error", value: e.message }];
    }
  }

  return payload;
}
