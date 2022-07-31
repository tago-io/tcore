import path from "path";
import fs from "fs";
import { listPluginFolders } from "../Services/Plugins";
import { oraLog, oraLogError } from "../Helpers/log";
import { getMainSettings, getPluginSettings } from "../Services/Settings";
import Plugin from "./Plugin/Plugin";
import { generatePluginID } from "./PluginID";
import { getPluginPackageJSON } from "./PluginPackage";

/**
 * List of plugins paths that are built-in but do not show up in the sidebar.
 */
export const HIDDEN_BUILT_IN_PLUGINS: string[] = [path.join(__dirname, "../../../tcore-plugin-filesystem-local")];

/**
 * List of plugins paths that are built-in as soon as tcore boots up.
 */
export const BUILT_IN_PLUGINS: string[] = [path.join(__dirname, "../../../../../tcore-plugins/tcore-plugin-sqlite")];

/**
 * Map containing the a key with the name of a plugin and the value
 * as an instance of the Plugin class.
 */
export const plugins: Map<string, Plugin> = new Map();

/**
 */
export async function startPlugin(folder: string) {
  const plugin = new Plugin(folder);
  const exists = plugins.get(plugin.id);
  if (exists) {
    // plugin already running and already inserted in the list
    throw new Error("Plugin is already running");
  }

  plugins.set(plugin.id, plugin);

  const settings = await getPluginSettings(plugin.id);
  if (settings.disabled) {
    await plugin.disable();
  } else {
    await plugin.start();
  }

  return plugin;
}

/**
 * Sorts all folders based on their priority:
 * First the main database plugin then the other plugins.
 */
async function sortFoldersByPriority(folders: string[]): Promise<string[]> {
  const settings = await getMainSettings();
  const dbModuleID = String(settings.database_plugin).split(":")?.[0];

  const result: string[] = [];

  for (const folder of folders) {
    const pkg = await getPluginPackageJSON(folder);
    if (!pkg) {
      continue;
    }

    const id = generatePluginID(pkg.name);
    const isDatabase = dbModuleID === id || pkg?.tcore?.types?.includes("database");

    if (isDatabase) {
      // main database plugin gets priority over other plugins
      result.unshift(folder);
    } else {
      // common plugin, not database
      result.push(folder);
    }
  }

  return result;
}

/**
 * Starts a single plugin from a folder and handle its errors.
 * If there is an error, it will be logged to the terminal.
 * If no errors are present in the plugin, it will say that the plugin is good to go.
 */
async function startPluginAndHandleErrors(folder: string) {
  try {
    const plugin = await startPlugin(folder);

    const modules = [...plugin.modules.values()];
    const errors = modules.filter((x) => x.error);

    if (errors.length === 1 && errors[0].error) {
      // only one module threw an error, show a single line of error
      throw new Error(errors[0].error);
    } else if (errors.length > 1) {
      // multiple modules threw errors, show multiline of errors, one for
      // each module that threw an error
      const msgs = errors.map((x) => `  - ${x.name}: ${x.error}`);
      const join = msgs.join("\n");
      throw new Error(`\n${join}`);
    }

    if (plugin.state === "started") {
      oraLog("api", `Started Plugin: ${plugin.tcoreName}`);
    } else if (plugin.state === "disabled") {
      oraLog("api", `Skipped Disabled Plugin: ${plugin.tcoreName}`);
    }
  } catch (ex: any) {
    const err = ex.message || ex;

    const pluginPkg = Plugin.getPackage(folder);
    const pluginName = pluginPkg.tcore?.name || pluginPkg.name;

    oraLogError("api", `Failed to start Plugin ${pluginName || ""}: ${err}`);
  }
}

/**
 * Initializes all the plugins.
 */
export async function startAllPlugins() {
  const folders = await listPluginFolders();
  const sorted = await sortFoldersByPriority(folders);

  for (const folder of sorted) {
    if (fs.existsSync(folder)) {
      await startPluginAndHandleErrors(folder);
    }
  }
}
