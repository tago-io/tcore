import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { getLocalPluginData } from "../Helpers/Plugin";
import { oraLog } from "../Helpers/Log";

/**
 * Disables one or more plugins.
 */
export async function disablePlugins(identifiers: string[]) {
  return await toggleDisabled(identifiers, true);
}

/**
 * Enables one or more plugins.
 */
export async function enablePlugins(identifiers: string[]) {
  return await toggleDisabled(identifiers, false);
}

/**
 * Disables/Enables one or more plugins.
 */
async function toggleDisabled(identifiers: string[], disable: boolean) {
  const settings = await API.getMainSettings();
  if (!fs.existsSync(settings.plugin_folder)) {
    oraLog("Plugin folder doesn't exist - could not read plugins").fail();
    return;
  }

  for (const identifier of identifiers) {
    await toggle(settings, identifier, disable);
  }
}

/**
 * Disables/Enables a single plugin.
 */
export async function toggle(settings: ISettings, identifier: string, disable: boolean) {
  const spinner = oraLog(identifier);

  const data = await getLocalPluginData(settings, identifier);
  if (!data) {
    spinner.fail(`${identifier} - ${chalk.redBright("Plugin not installed")}`);
  } else {
    if (data.disabled === disable) {
      const msg = `Plugin already ${disable ? "disabled" : "enabled"}`;
      spinner.fail(`${identifier} - ${chalk.yellow(msg)}`);
      return;
    }

    await API.setPluginDisabledSettings(data.id, disable);

    const msg = `Plugin successfully ${disable ? "disabled" : "enabled"}`;
    spinner.succeed(`${identifier} - ${chalk.green(msg)}`);
  }
}
