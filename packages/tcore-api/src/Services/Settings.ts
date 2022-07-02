import path from "path";
import fs from "fs";
import os from "os";
import { IPluginSettings, IPluginSettingsModule, ISettings } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields, getSystemName, getSystemSlug } from "@tago-io/tcore-shared";
import { plugins } from "../Plugins/Host";
import { loadYml, saveYml } from "../Helpers/Yaml";
import { rmdir } from "../Helpers/Files";
import { compareAccountPasswordHash, encryptAccountPassword } from "./Account/AccountPassword";
import { terminateAllPlugins } from "./Plugins";
import { decryptPluginConfigPassword, encryptPluginConfigPassword } from "./Plugin/PluginPassword";

/**
 * Folder name to save the settings.
 */
const folderName = os.platform() === "win32" ? getSystemName() : `.${getSystemSlug()}`;

/**
 * Checks if the master password is correct.
 * @returns {boolean} True for correct, false for incorrect.
 */
export async function checkMasterPassword(masterPassword: string): Promise<boolean> {
  const settings = await getMainSettings();
  const matches = await compareAccountPasswordHash(masterPassword, settings.master_password || "");
  return matches;
}

/**
 * Retrieves the main settings folder.
 */
export async function getMainSettingsFolder(): Promise<string> {
  const folder = path.join(os.homedir(), folderName);
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

/**
 * Retrieves the settings folder of a plugin.
 */
export async function getPluginSettingsFolder(pluginID: string): Promise<string> {
  const folder = path.join(os.homedir(), folderName, "PluginFiles", pluginID || "");
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

/**
 * Retrieves the plugins folder.
 */
export async function getPluginsFolder(): Promise<string> {
  const folder = path.join(os.homedir(), folderName, "Plugins");
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

/**
 * Retrieves the main settings of the application.
 */
export async function getMainSettings(): Promise<ISettings> {
  const folder = await getMainSettingsFolder();
  const data = await loadYml(path.join(folder, `${getSystemSlug()}.yml`));

  const filesystem_plugin = process.env.TCORE_FILESYSTEM_PLUGIN || data.filesystem_plugin || "";
  const database_plugin = process.env.TCORE_DATABASE_PLUGIN || data.database_plugin || "";
  const settings_folder = process.env.TCORE_SETTINGS_FOLDER || folder;
  const plugin_folder = process.env.TCORE_PLUGIN_FOLDER || data.plugin_folder || (await getPluginsFolder());
  const port = process.env.TCORE_PORT || data.port || "8888";
  const master_password = data.master_password || "";

  const settings: ISettings = {
    filesystem_plugin,
    database_plugin,
    plugin_folder,
    port,
    settings_folder,
    master_password,
  };

  if (!fs.existsSync(settings.plugin_folder || "")) {
    fs.promises.mkdir(settings.plugin_folder || "", { recursive: true });
  }

  return settings;
}

/**
 * Terminate all non-built in plugins and removes the settings folder.
 */
export async function doFactoryReset(): Promise<void> {
  const folder = await getMainSettingsFolder();
  await terminateAllPlugins();
  await rmdir(folder);
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setMainSettings(data: ISettings): Promise<void> {
  const folder = await getMainSettingsFolder();
  await saveYml(data, path.join(folder, `${getSystemSlug()}.yml`));
}

/**
 * Sets the master password.
 */
export async function setMasterPassword(password: string): Promise<void> {
  const settings = await getMainSettings();
  settings.master_password = await encryptAccountPassword(password);
  await setMainSettings(settings);
}

/**
 * Retrieves the settings of a plugin.
 */
export async function getPluginSettings(id: string): Promise<IPluginSettings> {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  const fileData = (await loadYml(filePath, {})) as IPluginSettings;

  for (const item of fileData.modules || []) {
    for (const key in item.values) {
      if (item.values[key]?.type === "password") {
        item.values[key] = decryptPluginConfigPassword(item.values[key].value);
      }
    }
  }

  return fileData;
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setPluginModulesSettings(id: string, values: any) {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  const plugin = plugins.get(id);
  const modules: IPluginSettingsModule[] = [];

  for (const item of values) {
    const module = plugin?.modules?.get(item.moduleID);
    const configs = flattenConfigFields(module?.setup.configs || []);
    const field = configs.find((x) => "field" in x && x.field === item.field);
    const isPassword = field?.type === "password";

    if (isPassword) {
      item.value = {
        type: "password",
        value: encryptPluginConfigPassword(item.value),
      };
    }

    const group = modules.find((x) => x.id === item.moduleID);
    if (group) {
      group.values[item.field] = item.value;
    } else {
      modules.push({ id: item.moduleID, values: { [item.field]: item.value } });
    }
  }

  const data: IPluginSettings = {
    disabled: plugin?.state === "disabled",
    modules,
  };

  await saveYml(data, filePath);
}

/**
 */
export async function setPluginSettings(id: string, settings: IPluginSettings) {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  await saveYml(settings, filePath);
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setPluginDisabledSettings(id: string, disabled: boolean) {
  const data = await getPluginSettings(id);
  data.disabled = disabled;
  await setPluginSettings(id, data);
}
