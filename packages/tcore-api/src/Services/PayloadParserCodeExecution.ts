import fs from "fs";
import vm from "vm";
import { IDevice, IDeviceAddDataOptions } from "@tago-io/tcore-sdk/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logError } from "../Helpers/log";
import { emitToLiveInspector } from "./LiveInspector";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

/**
 * Runs a payload parser script.
 * @param {IDevice} device Device object who sent the data.
 * @param {any} data The data to be passed to the parser' script.
 */
export const runPayloadParser = async (
  device: IDevice,
  payload?: any,
  options?: IDeviceAddDataOptions
): Promise<any> => {
  try {
    if (!device.payload_parser) {
      return payload;
    }

    const fileData = await fs.promises.readFile(device.payload_parser, "utf8").catch(() => null);
    if (!fileData) {
      throw new Error(`Payload parser file is empty or doesn't exist`);
    }

    const context = vm.createContext({
      payload,
      raw_payload: options?.rawPayload,
      dayjs,
      device: {
        id: device.id,
        tags: device.tags,
        params: [],
      },
      console: {
        log: (...args: any[]) => onLog(device, args, options),
        debug: (...args: any[]) => onLog(device, args, options),
        error: (...args: any[]) => onLog(device, args, options),
      },
    });

    const code = `Promise.resolve().then(async () => { await (async function() { ${fileData} }()); return payload; })`;
    const script = new vm.Script(code);
    const response = await script.runInContext(context);

    emitToLiveInspector(device, { title: "Result of payload parser", content: response }, options?.liveInspectorID);

    return response;
  } catch (error: any) {
    logError("api", `Unexpected error while running payload parser (${device.id}): ${error.message}`);
    emitToLiveInspector(device, { title: "Error on payload parser", content: error.message }, options?.liveInspectorID);
    return payload;
  }
};

/**
 */
function onLog(device: IDevice, args: any, options?: IDeviceAddDataOptions) {
  emitToLiveInspector(device, { title: "Log from payload parser", content: args[0] }, options?.liveInspectorID);
}
