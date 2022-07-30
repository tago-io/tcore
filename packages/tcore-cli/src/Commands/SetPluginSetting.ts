import path from "path";
import fs from "fs";
import { getMainSettings, getPluginSettings, Plugin, setPluginSettings } from "@tago-io/tcore-api";
import chalk from "chalk";
import { getSystemName } from "@tago-io/tcore-shared";
import { log, oraLog } from "../Helpers/Log";

/**
 * Set a single setting for a plugin.
 */
export async function setPluginSetting(id: string, mod: string, key: string, value: string) {
  const plugin = await getLocalPluginData(id);
  if (!plugin) {
    // we must have the plugin installed in order to know the actual ID
    oraLog(`Plugin ${chalk.redBright(id)} is not installed`).fail();
    return;
  }
  if (!key) {
    // Key is already validated against undefined, but we need to know if
    // the actual content is not empty, such as an empty string
    oraLog(`Invalid setting ${chalk.redBright("key")}`).fail();
    return;
  }

  oraLog(`Plugin ${chalk.green(plugin.name)} is installed`).succeed();

  const settings = await getPluginSettings(plugin.id);
  const modObject = settings.modules?.find((x) => x.id === mod);
  if (modObject) {
    // module already has some settings in the plugin file
    modObject.values = { ...modObject.values, [key]: value };
  } else {
    // module doesn't have settings in the plugin file
    settings.modules = [
      ...(settings.modules || []),
      {
        id: mod,
        disabled: false,
        values: { [key]: value },
      },
    ];
  }

  await setPluginSettings(plugin.id, settings);

  if (value === undefined || value === null) {
    // empty value to remove the setting
    log(`Setting ${chalk.green(key)} was removed from module ${chalk.green(mod)}`);
  } else if (value === "") {
    // value is an empty string
    log(`Setting ${chalk.green(key)} was set to ${chalk.green(`""`)} for module ${chalk.green(mod)}`);
  } else {
    // value has something in it and was changed
    log(`Setting ${chalk.green(key)} was set to ${chalk.green(value)} for module ${chalk.green(mod)}`);
  }

  log(`Restart ${getSystemName()} for the changes to take effect`);
}

/**
 * Retrieves the information of a local plugin by its identifier.
 * The identifier can be the `plugin ID` or the `plugin slug`.
 */
async function getLocalPluginData(identifier: string) {
  const settings = await getMainSettings();
  const plugins = await fs.promises.readdir(settings.plugin_folder);

  for (const id of plugins) {
    const pluginPath = path.join(settings.plugin_folder, id);
    const pluginPkg = await Plugin.getPackageAsync(pluginPath).catch(() => null);

    const pluginSlug = pluginPkg?.name;
    const pluginID = Plugin.generatePluginID(pluginSlug);

    if (pluginSlug === identifier || pluginID === identifier) {
      const pluginSettings = await getPluginSettings(pluginID);
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
