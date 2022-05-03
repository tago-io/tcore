import {
  IAction,
  IActionCreate,
  IActionEdit,
  IActionList,
  IActionListQuery,
  IActionOption,
  IActionTriggerModuleSetup,
  IActionType,
  IActionTypeModuleSetup,
  IDeviceData,
  TGenericID,
  zAction,
  zActionCreate,
  zActionEdit,
  zActionList,
  zActionListQuery,
} from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { Device } from "@tago-io/sdk";
import splitColon from "../Helpers/splitColon";
import { plugins } from "../Plugins/Host";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction";
import { runAnalysis } from "./AnalysisCodeExecution";
import { addDeviceData } from "./DeviceData/DeviceData";
import { getDeviceByToken } from "./Device";
import { getModuleList } from "./Plugins";

/**
 * Validates an action ID, throws an error if it doesn't exist.
 */
export async function validateActionID(id: TGenericID): Promise<void> {
  const action = await invokeDatabaseFunction("getActionInfo", id);
  if (!action) {
    throw new Error("Invalid Action ID");
  }
}

/**
 * Lists all the action triggers.
 */
export function getActionTriggers(): IActionType[] {
  const options: IActionType[] = [];
  const modules = getModuleList("action-trigger");

  for (const module of modules) {
    const option = (module.setup as unknown as IActionTriggerModuleSetup).option;

    const type: IActionType = {
      configs: option.configs || [],
      description: option.description,
      id: `${module.plugin.id}:${module.setup.id}`,
      name: option.name,
      showDeviceSelector: !!option.showDeviceSelector,
    };

    options.push(type);
  }

  return options;
}

/**
 * Lists all the action types.
 */
export function getActionTypes(): IActionOption[] {
  const options: IActionOption[] = [];
  const modules = getModuleList("action-type");

  for (const module of modules) {
    const option = (module.setup as unknown as IActionTypeModuleSetup).option;
    options.push({ ...option, id: `${module.plugin.id}:${module.setup.id}` } as any);
  }

  return options;
}

/**
 * Lists all the actions.
 */
export const getActionList = async (query: IActionListQuery): Promise<IActionList> => {
  const queryParsed = await zActionListQuery.parseAsync(query);
  const response = await invokeDatabaseFunction("getActionList", queryParsed);
  const parsed = await zActionList.parseAsync(response);
  return parsed;
};

/**
 * Retrieves all the information of a single action.
 */
export async function getActionInfo(id: TGenericID): Promise<IAction> {
  const action = await invokeDatabaseFunction("getActionInfo", id);
  if (!action) {
    throw new Error("Invalid Action ID");
  }
  const parsed = await zAction.parseAsync(action);
  return parsed;
}

/**
 */
export function shouldNativeActionTrigger(action: Partial<IAction>, data: IDeviceData[]): boolean {
  const conditions = action.trigger?.conditions || [];
  for (const item of data) {
    for (const trigger of conditions) {
      const itemValue = Number(item.value);

      const triggerValue = Number(trigger.value);
      const triggerSecondValue = Number(trigger.second_value);

      if (item.variable === trigger.variable) {
        if (trigger.is === "=" && itemValue === triggerValue) return true;
        if (trigger.is === "<>" && itemValue !== triggerValue) return true;
        if ((!trigger.is || trigger.is === "<") && itemValue < triggerValue) return true;
        if (trigger.is === ">" && itemValue > triggerValue) return true;
        if (trigger.is === "><" && itemValue > triggerValue && itemValue < triggerSecondValue) return true;
        if (trigger.is === "*") return true;
      }

      return false;
    }
  }

  return false;
}

/**
 * Triggers an action.
 */
export async function triggerAction(id: TGenericID, data?: any): Promise<void> {
  await validateActionID(id);

  const action = await getActionInfo(id);
  const actionObject = action.action;

  const usesPluginTrigger = actionObject.type?.includes(":");
  if (usesPluginTrigger) {
    // custom type for the action
    triggerActionPluginType(action, data);
  } else if (actionObject.type === "script") {
    // analysis type
    triggerActionScriptType(action, data);
  } else if (actionObject.type === "post") {
    // post HTTP type
    triggerActionPostType(action, data);
  } else if (actionObject.type === "tagoio") {
    // post to TagoIO
    triggerActionTagoIOType(action, data);
  }

  editAction(id, { last_triggered: new Date() });
}

/**
 * Triggers an action that redirects data to TagoIO.
 */
async function triggerActionTagoIOType(action: IAction, data: any): Promise<void> {
  const token = action?.action?.token;
  if (!token) {
    return;
  }

  const device = new Device({ token, region: "usa-1" });
  await device.sendData(data);
}

/**
 * Triggers an action that does a POST HTTP.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the analyses.
 */
async function triggerActionPostType(action: IAction, data: any): Promise<void> {
  if (!action?.action?.url) {
    return;
  }

  const headers = Array.isArray(action.action.headers) ? action.action.headers : [];
  const headersObj = {};

  for (const headerItem of headers) {
    headersObj[headerItem.name] = headerItem.value;
  }

  for (let i = 0; i < 10; i++) {
    try {
      headersObj["TagoIO-Retries"] = i + 1;
      await axios({
        method: "POST",
        data,
        url: action.action.url,
        headers: headersObj,
      });
      return;
    } catch (ex) {
      // error
    }
  }

  if (action.action.http_post_fallback_enabled && action.action.fallback_token) {
    const device = await getDeviceByToken(action.action.fallback_token);
    await addDeviceData(device.id, data);
  }
}

/**
 * Triggers an action that runs analyses.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the analyses.
 */
async function triggerActionScriptType(action: IAction, data: any): Promise<void> {
  const analyses = action?.action?.analyses;
  for (const analysis of analyses) {
    runAnalysis(analysis, data);
  }
}

/**
 * Triggers an action with a custom plugin type.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the onCall of the action.
 */
async function triggerActionPluginType(action: IAction, data: any): Promise<void> {
  const actionObject = action.action;
  if (!actionObject.type?.includes(":")) {
    return;
  }

  const [pluginID, moduleID] = splitColon(action?.action.type);
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  delete actionObject.type;

  await module?.invokeOnCall(action.id, actionObject, data).catch(() => false);
}

/**
 * Invokes the `onTriggerChange` in the `action-trigger` plugins.
 */
export async function invokeActionOnTriggerChange(id: TGenericID, actionType: string, actionTrigger: any) {
  const modules = getModuleList("action-trigger");

  for (const module of modules) {
    const usesPluginTrigger = actionType?.includes(":");
    if (usesPluginTrigger) {
      const [pluginID, moduleID] = splitColon(actionType);
      if (module.setup.id === moduleID && module.plugin.id === pluginID) {
        module.invokeOnTriggerChange(id, actionTrigger);
      }
    }
  }
}

/**
 * Edits a single action.
 */
export async function editAction(id: TGenericID, action: IActionEdit): Promise<void> {
  const oldAction = await getActionInfo(id);

  const parsed = await zActionEdit.parseAsync(action);
  await invokeDatabaseFunction("editAction", id, parsed);

  const triggerChanged = JSON.stringify(oldAction.trigger) !== JSON.stringify(parsed.trigger);
  if (triggerChanged) {
    invokeActionOnTriggerChange(id, oldAction.type, action.trigger);
  }
}

/**
 * Deletes a single action.
 */
export async function deleteAction(id: TGenericID): Promise<void> {
  await validateActionID(id);
  await invokeDatabaseFunction("deleteAction", id);
}

/**
 * Creates a new action.
 */
export async function createAction(action: IActionCreate): Promise<TGenericID> {
  const parsed = await zActionCreate.parseAsync(action);
  await invokeDatabaseFunction("createAction", parsed);
  return parsed.id;
}
