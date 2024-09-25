import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import semver from "semver";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { oraLog } from "../Helpers/Log";
import { getLocalPluginData } from "../Helpers/Plugin";
import { findPluginStoreInstallURL, getStorePluginInfo } from "../Helpers/PluginStore";
// @ts-ignore
import pkg from "../../../package.json";

const nameRegex = new RegExp("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*");
const md5Regex = new RegExp("^[a-f0-9]{32}");

/**
 * Installs one or more plugins.
 */
export async function installPlugins(identifiers: string[]) {
  const settings = await API.getMainSettings();
  if (!fs.existsSync(settings.plugin_folder)) {
    oraLog("Plugin folder doesn't exist - could not read plugins").fail();
    return;
  }

  let amount = 0;
  for (const identifier of identifiers) {
    let installed = false;
    if (identifier.endsWith(".tcore")) {
      installed = await installPluginFile(identifier);
    } else {
      installed = await installPlugin(settings, identifier);
    }
    if (installed) {
      amount += 1;
    }
  }

  if (amount >= 1) {
    oraLog("Restart TagoCore to use the newly installed Plugins").succeed();
  }
}

/**
 * Installs a plugin via file.
 */
async function installPluginFile(identifier: string) {
  const spinner = oraLog(identifier);
  const exists = fs.existsSync(identifier);
  if (!exists) {
    spinner.fail(`${identifier} - file ${chalk.redBright("not found")}`);
    return false;
  }

  try {
    await API.installPlugin(identifier);

    const chalked = chalk.green(`file successfully installed`);
    spinner.succeed(`${identifier} - ${chalked}`);
    return true;
  } catch (ex: any) {
    spinner.fail(`${identifier} - ${chalk.redBright(ex?.message || ex)}`);
  }

  return false;
}

/**
 * Installs a single plugin by identifier (id/slug).
 */
async function installPlugin(settings: ISettings, identifier: string) {
  const [id, desiredVersion] = extractIdentifier(identifier);
  const spinner = oraLog(identifier);

  try {
    const fields = ["version", "name", "tagocore_version", "install_urls { platform, url }"];
    const plugin = await getStorePluginInfo(id, fields, desiredVersion);

    const storeVersion = plugin.version;
    const versionCompatible = semver.satisfies(pkg.version, plugin.tagocore_version);
    const url = findPluginStoreInstallURL(plugin.install_urls);
    if (!url) {
      throw new Error(`v${storeVersion} is not compatible with your TagoCore`);
    }
    if (!versionCompatible) {
      throw new Error(
        `v${storeVersion} is not compatible with your TagoCore (only ${plugin.tagocore_version})`
      );
    }

    const data = await getLocalPluginData(settings, id);
    if (data?.pkg) {
      // local plugin already exists, let's see if the version is the same.
      // If the version is the same, we don't need to install it again.
      if (semver.eq(data.pkg.version, storeVersion)) {
        throw new Error(`v${storeVersion} already installed`);
      }
    }

    await API.installPlugin(url as string);

    const chalked = chalk.green(`v${plugin.version} successfully installed`);
    spinner.succeed(`${identifier} - ${chalked}`);
    return true;
  } catch (ex: any) {
    spinner.fail(`${identifier} - ${chalk.redBright(ex?.message || ex)}`);
  }

  return false;
}

/**
 * Extracts identifier and version.
 */
function extractIdentifier(id: string) {
  let remaining = id;

  if (md5Regex.test(id)) {
    remaining = id.replace(md5Regex, "");
  } else if (nameRegex.test(id)) {
    remaining = id.replace(nameRegex, "");
  }

  if (remaining === "") {
    // no version
    return [id];
  } else if (remaining.startsWith("@")) {
    // version was informed
    const version = remaining.substring(1);
    const valid = semver.valid(version);
    if (!valid) {
      throw new Error("Invalid version");
    }

    const identifier = id.replace(remaining, "");
    return [identifier, version];
  }

  return [id];
}
