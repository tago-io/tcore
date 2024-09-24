import path from "path";
import fs from "fs";
import * as API from "@tago-io/tcore-api";
import { ISettings } from "@tago-io/tcore-sdk/types";

/**
 * Retrieves the information of a local plugin by its identifier.
 * The identifier can be the `plugin ID` or the `plugin slug`.
 */
async function getLocalPluginData(settings: ISettings, identifier: string) {
  const plugins = await fs.promises.readdir(settings.plugin_folder);

  for (const id of plugins) {
    const pluginPath = path.join(settings.plugin_folder, id);
    const pluginPkg = await getPackage(pluginPath).catch(() => null);

    const pluginSlug = pluginPkg?.name;
    const pluginID = API.Plugin.generatePluginID(pluginSlug);
    const pluginSettings = await API.getPluginSettings(pluginID);

    if (pluginSlug === identifier || pluginID === identifier) {
      return {
        folder: pluginPath,
        id: pluginID,
        name: pluginPkg.name,
        pkg: pluginPkg,
        slug: pluginSlug,
        disabled: pluginSettings?.disabled || false,
      };
    }
  }

  return null;
}

/**
 * Gets package async.
 */
async function getPackage(folder: string) {
  return API.Plugin.getPackage(folder);
}

export { getLocalPluginData };
