import fs from "fs";
import path from "path";
import semver from "semver";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { getSystemName, SQLITE_PLUGIN_ID } from "@tago-io/tcore-shared";
import ora from "ora";
import chalk from "chalk";
import { extractTar } from "../Helpers/Tar/Tar";
import { getMainSettings, setMainSettings } from "./Settings";
import { getVersion } from "./System";

/**
 * Indicates if a version migration should happen.
 */
async function shouldMigrate(settings: ISettings) {
  const currentVersion = getVersion();
  const settingVersion = settings.version || "0.0.1";
  const thisVersionIsNewer = !semver.valid(settingVersion) || semver.gt(currentVersion, settingVersion);
  return thisVersionIsNewer;
}

/**
 * Checks to see if it should run the version migration and runs if necessary.
 */
export async function runVersionMigration() {
  const settings = await getMainSettings();
  const migrate = await shouldMigrate(settings);
  if (!migrate) {
    return;
  }

  const version = getVersion();
  const name = getSystemName();
  const spinner = ora(`Configuring version ${version} of ${name}`).start();

  try {
    await extractBuiltInPlugins(settings).catch(() => null);
    spinner.succeed(`Configured version ${chalk.green(version)} of ${chalk.green(name)}!`);
  } catch (ex: any) {
    const err = ex?.message || ex?.toString?.() || ex;
    spinner.fail(`Could not configure version ${version}: ${chalk.redBright(err)}`);
  } finally {
    await updateSettingsVersion(settings);
  }
}

/**
 * Extract built-in plugins from the `plugins` root folder.
 */
async function extractBuiltInPlugins(settings: ISettings) {
  const folder = path.join(__dirname, "../../../../plugins");
  const zipPaths = await fs.promises.readdir(folder);
  const usingSQLite = !settings.database_plugin || settings.database_plugin.includes(SQLITE_PLUGIN_ID);

  for (const filename of zipPaths) {
    const isSQLite = filename.includes(SQLITE_PLUGIN_ID);
    if (isSQLite && !usingSQLite) {
      // we can only extract the sqlite zip if the user is actively using the sqlite plugin.
      // if the user isn't using the sqlite as the main database, we skip the extraction.
      continue;
    }
    if (!filename.endsWith(".tcore")) {
      // only plugin files will be extracted
      continue;
    }

    const fullOrigin = path.join(folder, filename);
    const fullDestination = path.join(settings.plugin_folder, filename.replace(".tcore", ""));
    await extractTar(fullOrigin, fullDestination, true).catch(() => null);
  }
}

/**
 * Updates the version in settings to prevent duplicated version migrations.
 */
async function updateSettingsVersion(settings: ISettings) {
  const version = getVersion();
  await setMainSettings({ ...settings, version });
}
