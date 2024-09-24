import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import semver from "semver";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { getLocalPluginData } from "../Helpers/Plugin";
import { oraLog } from "../Helpers/Log";
import { findPluginStoreInstallURL, getStorePluginInfo } from "../Helpers/PluginStore";

/**
 * Updates one or more plugins.
 */
export async function updatePlugins(identifiers: string[]) {
  const settings = await API.getMainSettings();
  if (!fs.existsSync(settings.plugin_folder)) {
    oraLog("Plugin folder doesn't exist - could not read plugins").fail();
    return;
  }

  for (const identifier of identifiers) {
    await updatePlugin(settings, identifier);
  }
}

/**
 * Updates a single plugin.
 */
export async function updatePlugin(settings: ISettings, identifier: string) {
  const spinner = oraLog(identifier);

  const data = await getLocalPluginData(settings, identifier);
  if (!data?.pkg) {
    spinner.fail(`${identifier} - ${chalk.redBright("Plugin not installed")}`);
    return;
  }

  const fields = ["version", "install_urls { platform, url }"];
  const plugin = await getStorePluginInfo(identifier, fields).catch(() => null);

  if (!plugin || semver.eq(data.pkg.version, plugin.version)) {
    spinner.succeed(`${identifier} - ${chalk.yellow("Already up to date")} (v${plugin.version})`);
    return;
  }

  const url = findPluginStoreInstallURL(plugin.install_urls);
  if (url) {
    await API.installPlugin(url as string);
    spinner.succeed(`${identifier} - ${chalk.green(`Updated to v${plugin.version}`)}`);
  }
}
