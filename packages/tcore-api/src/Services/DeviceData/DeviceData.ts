import {
  TGenericID,
  IDeviceDataQuery,
  IDeviceData,
  zDeviceDataCreate,
  zDeviceData,
  zDeviceDataQuery,
  IDevice,
  generateResourceID,
  IDeviceAddDataOptions,
  zDeviceDataUpdate,
  IDeviceChunkPeriod,
  IDeviceDataCreate,
} from "@tago-io/tcore-sdk/types";
import { z } from "zod";
import { DateTime } from "luxon";
import removeNullValues from "../../Helpers/removeNullValues";
import splitColon from "../../Helpers/splitColon";
import { plugins } from "../../Plugins/Host";
import { invokeDatabaseFunction } from "../../Plugins/invokeDatabaseFunction";
import { editAction, getActionList, getConditionTriggerMatchingData, triggerAction } from "../Action";
import { editDevice, getDeviceInfo } from "../Device";
import { addStatistic } from "../Statistic";
import { runPayloadParser } from "../PayloadParserCodeExecution";
import { emitToLiveInspector, getLiveInspectorID } from "../LiveInspector";
import { getMainQueueModule, triggerHooks } from "../Plugins";

const LIMIT_DATA_ON_MUTABLE = 50_000;
const MAXIMUM_MONTH_RANGE = 1.1;

/**
 * Gets the chunk timestamps for a date.
 */
function getChunkTimestamp(date: Date, device: IDevice) {
  const dateJS = DateTime.fromJSDate(date).toUTC();

  if (!device?.chunk_period) {
    // pre 0.6.0 devices or immutable devices don't have chunk_period
    return null;
  }

  if (!dateJS.isValid) {
    throw "Invalid Database Chunk Address (date)";
  }

  const startDate = dateJS.startOf(device.chunk_period).toJSDate();
  const endDate = dateJS.endOf(device.chunk_period).toJSDate();

  return { startDate, endDate };
}

/**
 * Empties a device completely.
 */
export async function emptyDevice(deviceID: TGenericID) {
  const device = await getDeviceInfo(deviceID);
  await invokeDatabaseFunction("emptyDevice", deviceID, device.type);
}

/**
 * Retrieves the data amount in a device.
 */
export const getDeviceDataAmount = async (deviceID: TGenericID): Promise<number> => {
  const device = await getDeviceInfo(deviceID);
  const response = await invokeDatabaseFunction("getDeviceDataAmount", deviceID, device.type);
  const parsed = await z.number().parseAsync(response);
  return parsed;
};

/**
 * Triggers all the actions related to the device that just sent the last data insert.
 */
export const triggerActions = async (deviceID: TGenericID, data: IDeviceData[]): Promise<void> => {
  const device = await getDeviceInfo(deviceID);
  const actions = await getActionList({
    filter: { active: true, type: "condition" },
    fields: ["lock", "trigger"],
    amount: 999999,
  });

  for (const action of actions) {
    const triggers = Array.isArray(action.trigger) ? action.trigger : [];
    const hasLocker = triggers.some?.((x) => x.unlock);
    action.lock = hasLocker ? action.lock : false; // ? set false when action doesn't have any rule for unlock.

    const conditionsLock = triggers.filter((x) => !x.unlock);
    const conditionsUnlock = triggers.filter((x) => x.unlock);

    if (action.lock) {
      // action is locked, meaning we need to find a condition which can
      // release/unlock the action
      const dataItem = data.find((x) => getConditionTriggerMatchingData(conditionsUnlock, device, x));
      if (dataItem) {
        await editAction(action.id, { lock: false });
      }
    } else {
      // action is unlocked, meaning we need to find a condition
      // which can trigger the action
      const dataItem = data.find((x) => getConditionTriggerMatchingData(conditionsLock, device, x));
      if (dataItem) {
        await triggerAction(action.id, data);
        await editAction(action.id, { lock: hasLocker });
      }
    }
  }
};

/**
 * Applies all payload encoders available in order of priority.
 */
export const applyPayloadEncoder = async (
  device: IDevice,
  data: any,
  options?: IDeviceAddDataOptions
): Promise<any> => {
  const stack = device.encoder_stack || [];

  let lastData: any = data;
  for (const encoder of stack) {
    try {
      const [pluginID, moduleID] = splitColon(encoder);
      const plugin = plugins.get(pluginID);
      if (!plugin) {
        emitToLiveInspector(device, { title: "Encoder plugin not found", content: pluginID }, options?.liveInspectorID);
        continue;
      }

      const module = plugin.modules.get(moduleID);

      if (!module) {
        emitToLiveInspector(device, { title: "Encoder module not found", content: moduleID }, options?.liveInspectorID);
        continue;
      }

      lastData = await module.invokeOnCall(lastData);
      emitToLiveInspector(
        device,
        {
          title: `Applied encoder ${module.name}`,
          content: lastData || "null",
        },
        options?.liveInspectorID
      );
    } catch (ex: any) {
      const content = ex?.message || ex?.toString?.() || "Unknown error";
      emitToLiveInspector(device, { title: "Error while encoding data", content }, options?.liveInspectorID);
    }
  }

  return lastData;
};

/**
 * Checks if the immutable `time` is out of range.
 */
function isImmutableTimeOutOfRange(time: Date, period: IDeviceChunkPeriod, retention: number) {
  const date = DateTime.fromJSDate(time);
  const startDate = DateTime.utc()
    .minus({ [period]: retention })
    .startOf(period);
  const endDate = DateTime.utc().plus({ day: 1 }).endOf("day");

  return {
    isOk: date >= startDate && date <= endDate,
    startDate: startDate.toISODate(),
    endDate: endDate.toISODate(),
  };
}

/**
 * Adds data into a device by an actual device object.
 * @param {IDevice} device Device object who sent the data.
 * @param {any} data Data to be inserted.
 */
export const addDeviceDataByDevice = async (device: IDevice, data: any, options?: IDeviceAddDataOptions) => {
  if (!device || !device.active) {
    throw new Error("Device not found or inactive");
  }
  if (!options) {
    options = {};
  }
  if (!options.liveInspectorID) {
    options.liveInspectorID = getLiveInspectorID(device);
  }

  if (Array.isArray(data)) {
    options.rawPayload = data;
  } else if (typeof data === "object") {
    options.rawPayload = [data];
  } else {
    options.rawPayload = data;
  }

  if (device.type === "mutable") {
    const amount = await getDeviceDataAmount(device.id);
    if (amount >= LIMIT_DATA_ON_MUTABLE) {
      throw new Error(`The device has reached the limit of ${LIMIT_DATA_ON_MUTABLE} data registers`);
    }
  }

  let items: any = data;
  items = await applyPayloadEncoder(device, items, options);
  items = await runPayloadParser(device, items, options);
  items = await z.array(zDeviceDataCreate).parseAsync([items].flat());

  for (const item of items) {
    if (device.type === "immutable" && device.chunk_period) {
      const outOfRage = isImmutableTimeOutOfRange(item.time, device.chunk_period, device.chunk_retention || 0);

      if (!outOfRage.isOk) {
        const title = `Time must be between ${outOfRage.startDate} and ${outOfRage.endDate}`;
        await emitToLiveInspector(device, { title, content: item }, options.liveInspectorID);
        throw new Error(title);
      }
    }
  }

  await emitToLiveInspector(device, { title: "Raw Payload", content: data }, options.liveInspectorID);

  const group = generateResourceID().split("").reverse().join("");
  const now = new Date();

  for (const item of items) {
    item.group = item.group ?? item.serie ?? group;
    item.time = item.time || now;
    item.type = typeof item.value;
    item.created_at = now;
    delete item.serie;
  }

  // map the items to insert into database
  const dbInsertItems = items.map((x: IDeviceDataCreate) => {
    const chunkTimestamp = getChunkTimestamp(x.time as Date, device);
    return {
      ...x,
      chunk_timestamp_start: chunkTimestamp?.startDate,
      chunk_timestamp_end: chunkTimestamp?.endDate,
    };
  });

  if (options.byPassQueue) {
    return await addDataToDatabase(device, dbInsertItems);
  }

  return await addDataToQueue(device, dbInsertItems);
};

export async function addDataToDatabase(device: IDevice, data: any) {
  await invokeDatabaseFunction("addDeviceData", device.id, device.type, data);

  triggerActions(device.id, data).catch(() => null);
  await addStatistic({ input: data.length });
  await editDevice(device.id, { last_input: new Date() });

  triggerHooks("onAfterInsertDeviceData", device.id, data);

  return `${data.length} items added`;
}

export async function addDataToQueue(device: IDevice, data: any) {
  const queue = await getMainQueueModule();

  if (!queue) {
    return await addDataToDatabase(device, data);
  }

  await queue.invoke("onAddDeviceData", device.id, data);

  return `${data.length} items added to queue`;
}

/**
 * Adds data into a device by device ID.
 * @param {TGenericID} deviceID ID of the device who sent the data.
 * @param {any} data Data to be inserted.
 */
export async function addDeviceData(deviceID: TGenericID, data: any, options?: { forceDBInsert: boolean }) {
  const device = await getDeviceInfo(deviceID);

  if (options?.forceDBInsert) {
    return await addDataToDatabase(device, data);
  }

  return await addDeviceDataByDevice(device, data);
}

/**
 */
export async function editDeviceData(deviceID: TGenericID, data: any[]) {
  const device = await getDeviceInfo(deviceID);
  if (device.type === "immutable") {
    throw new Error("You cannot edit data on immutable device");
  }

  const payload = [data].flat();
  const amount = Array.isArray(payload) ? payload.length : 1;
  if (amount > 25) {
    throw new Error("You have exceeded the maximum number of 25 items in a single request");
  }

  for (let i = 0; i < payload.length; i++) {
    const parsed: any = await zDeviceDataUpdate.parseAsync(payload[i]);
    if ("value" in parsed) {
      parsed.type = typeof parsed.value;
    }
    payload[i] = parsed;
  }

  return await invokeDatabaseFunction("editDeviceData", deviceID, device.id, payload);
}

/**
 * Retrieves data from a device.
 */
export const getDeviceDataByDevice = async (
  device: IDevice,
  query?: IDeviceDataQuery
): Promise<IDeviceData[] | number> => {
  if (!query) {
    query = {};
  }

  query = zDeviceDataQuery.parse(query) as IDeviceDataQuery;

  if (device.type === "immutable" && query.ids?.length) {
    throw new Error("Filter using ID(s) is not supported on Immutable Storage Type");
  }

  if (query.query === "count") {
    return await invokeDatabaseFunction("getDeviceDataCount", device.id, device.type, query);
  } else if (query.query === "avg") {
    await validateMonthRange(query);
    return await invokeDatabaseFunction("getDeviceDataAvg", device.id, device.type, query);
  } else if (query.query === "sum") {
    await validateMonthRange(query);
    return await invokeDatabaseFunction("getDeviceDataSum", device.id, device.type, query);
  } else {
    let response: any[] = [];

    if (!query.query || query.query === "defaultQ") {
      response = await invokeDatabaseFunction("getDeviceDataDefaultQ", device.id, device.type, query);
    } else if (query.query === "last_value") {
      response = await invokeDatabaseFunction("getDeviceDataLastValue", device.id, device.type, query);
    } else if (query.query === "last_location") {
      response = await invokeDatabaseFunction("getDeviceDataLastLocation", device.id, device.type, query);
    } else if (query.query === "last_item") {
      response = await invokeDatabaseFunction("getDeviceDataLastItem", device.id, device.type, query);
    } else if (query.query === "last_insert") {
      response = await invokeDatabaseFunction("getDeviceDataLastInsert", device.id, device.type, query);
    } else if (query.query === "first_value") {
      response = await invokeDatabaseFunction("getDeviceDataFirstValue", device.id, device.type, query);
    } else if (query.query === "first_location") {
      response = await invokeDatabaseFunction("getDeviceDataFirstLocation", device.id, device.type, query);
    } else if (query.query === "first_item") {
      response = await invokeDatabaseFunction("getDeviceDataFirstItem", device.id, device.type, query);
    } else if (query.query === "first_insert") {
      response = await invokeDatabaseFunction("getDeviceDataFirstInsert", device.id, device.type, query);
    } else if (query.query === "min") {
      await validateMonthRange(query);
      response = await invokeDatabaseFunction("getDeviceDataMin", device.id, device.type, query);
    } else if (query.query === "max") {
      await validateMonthRange(query);
      response = await invokeDatabaseFunction("getDeviceDataMax", device.id, device.type, query);
    }

    for (let i = 0; i < response.length; i++) {
      response[i].device = device.id;
      response[i].group = response[i].group || response[i].serie;
      response[i] = removeNullValues(response[i]);
      if (!query.details) {
        delete response[i].created_at;
      }
    }

    let items: any = await z.array(zDeviceData).parseAsync(response);
    items = await z.array(zDeviceData).parseAsync(items);

    await addStatistic({ output: items.length });

    return items;
  }
};

/**
 */
export const getDeviceData = async (id: TGenericID, query?: IDeviceDataQuery) => {
  const device = await getDeviceInfo(id);
  return await getDeviceDataByDevice(device, query);
};

/**
 * Deletes data from a device.
 * @returns {number} The amount of data deleted from the device.
 */
export async function deleteDeviceData(id: TGenericID, query?: IDeviceDataQuery): Promise<number> {
  const device = await getDeviceInfo(id);
  if (device.type === "immutable") {
    throw new Error("Data in immutable devices cannot be deleted");
  }

  const data = await getDeviceData(id, query);

  if (!Array.isArray(data)) {
    throw new Error("Invalid query");
  }

  const dataIDs = (data as IDeviceData[]).map((x) => x.id);

  await invokeDatabaseFunction("deleteDeviceData", id, device.id, dataIDs);

  return data.length;
}

async function validateMonthRange(query: IDeviceDataQuery) {
  if (!query.start_date) {
    throw new Error("start_date field is required");
  }

  const startDate = query.start_date as Date;
  const endDate = query.end_date || new Date();
  const diff = DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(startDate), "months").toObject();
  const value = diff.months || 0;
  if (value > MAXIMUM_MONTH_RANGE) {
    throw new Error(`The maximum range for ${query.query} is 1 month between start_end and end_date`);
  }
}
