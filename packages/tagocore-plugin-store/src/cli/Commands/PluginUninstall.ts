import path from "path";
import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { oraLog } from "../Helpers/Log";

/**
 * Uninstalls one or more plugins.
 */
export async function uninstallPlugins(identifiers: string[]) {
  const settings = await API.getMainSettings();
  if (!fs.existsSync(settings.plugin_folder)) {
    oraLog("Plugin folder doesn't exist - could not read plugins").fail();
    return;
  }

  for (const identifier of identifiers) {
    await uninstallPlugin(settings, identifier);
  }
}

/**
 * Uninstalls a single plugin and logs the output.
 */
async function uninstallPlugin(settings: ISettings, identifier: string) {
  const spinner = oraLog(identifier);

  try {
    const plugins = await fs.promises.readdir(settings.plugin_folder);

    for (const id of plugins) {
      const pluginPath = path.join(settings.plugin_folder, id);
      const pluginPkg = await getPackage(pluginPath).catch(() => null);

      const pluginName = pluginPkg?.name;
      const pluginID = API.Plugin.generatePluginID(pluginName);

      if (pluginName === identifier || pluginID === identifier) {
        try {
          // delete the folder manually
          await API.uninstallPluginByFolder(pluginPath);

          spinner.succeed(`${identifier} - ${chalk.green("Successfully uninstalled")}`);
        } catch (ex) {
          spinner.succeed(`${identifier} - ${chalk.redBright("Could not uninstall plugin")}`);
        }

        return;
      }
    }

    spinner.fail(`${identifier} - ${chalk.yellow("Plugin is not installed")}`);
  } catch (ex: any) {
    const message = ex?.message || ex;
    spinner.fail(`${identifier} - ${chalk.redBright(message)}`);
  }
}

/**
 * Gets package async.
 */
async function getPackage(folder: string) {
  return API.Plugin.getPackage(folder);
}
