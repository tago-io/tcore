import fs from "fs";
import path from "path";
import semver from "semver";
import { ISettings } from "@tago-io/tcore-sdk/types";
import { SQLITE_PLUGIN_ID } from "@tago-io/tcore-shared";
import { extractTar } from "../Helpers/Tar/Tar";
import { getMainSettings, setMainSettings } from "./Settings";
import { getVersion } from "./System/System";

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

  try {
    await extractBuiltInPlugins(settings).catch(() => null);
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
