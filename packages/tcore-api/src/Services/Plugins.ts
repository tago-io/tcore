import fs from "fs";
import path from "path";
import md5 from "md5";
import { IPlugin, TGenericID, TPluginType, IPluginList, IPluginListItem, ISettings } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import semver from "semver";
import Module from "../Plugins/Module/Module";
import { DEV_BUILT_IN_PLUGINS, plugins, startPluginAndHandleErrors } from "../Plugins/Host";
import Plugin from "../Plugins/Plugin/Plugin";
import { getMainSettings, getPluginSettings, setMainSettings } from "./Settings";
import { getVersion } from "./System";

interface IPluginPackage {
  name: string;
  id: string;
  version: string;
  short_description: string;
  logo_url: string;
  full_description_url: string;
  fullPath: string;
  publisher: {
    name: string;
    domain: string;
    __typename: string;
  };
  __typename: string;
}

/**
 * Filters and maps the button modules for the plugin list.
 */
function mapButtonModules(modules: Module[], type: TPluginType) {
  return modules
    .filter((x: any) => x.setup.type === type && x.setup.option)
    .map((x) => {
      const setup = x.setup as any;
      return {
        action: setup.option?.action,
        color: setup.option?.color,
        icon: setup.option?.icon,
        text: setup.option?.text,
        position: setup.option?.position,
      };
    });
}

/**
 * Lists all the plugins that are loaded.
 */
export async function getLoadedPluginList(): Promise<IPluginList> {
  const settings = await getMainSettings();
  const result: IPluginList = [];

  const dbPluginID = String(settings.database_plugin).split(":")[0];

  for (const plugin of plugins.values()) {
    const modules = [...(plugin?.modules?.values?.() || [])];

    const error = !!plugin?.error || modules.some((x) => x.error);

    const allow_disable = dbPluginID !== plugin.id;
    const allow_uninstall = dbPluginID !== plugin.id;

    const object: IPluginListItem = {
      buttons: {
        navbar: mapButtonModules(modules, "navbar-button"),
        sidebar: mapButtonModules(modules, "sidebar-button"),
        sidebarFooter: mapButtonModules(modules, "sidebar-footer-button"),
      },
      allow_disable,
      allow_uninstall,
      error: error,
      hidden: plugin.package.tcore?.hidden,
      id: plugin.id,
      name: plugin.tcoreName || "",
      state: plugin?.state || "stopped",
      version: plugin.version,
      types: plugin?.types || [],
      description: plugin?.description,
      publisher: plugin?.publisher,
    };

    result.push(object);
  }

  return result;
}

/**
 */
export async function listPluginFolders(): Promise<string[]> {
  const settings = await getMainSettings();
  const root = settings.plugin_folder;
  const folders = await fs.promises.readdir(root);
  const plugins: string[] = [];

  for (const folder of folders) {
    const fullPath = path.join(root, folder);
    const hasPackage = await Plugin.getPackageAsync(fullPath).catch(() => null);
    if (hasPackage) {
      plugins.push(fullPath);
    }
  }

  await getInstalledInsidePlugins(plugins, settings);

  for (const item of DEV_BUILT_IN_PLUGINS || []) {
    const hasPackage = await Plugin.getPackageAsync(item).catch(() => null);
    if (hasPackage && !plugins.includes(item)) {
      plugins.unshift(item);
    }
  }

  return plugins;
}

async function getInstalledInsidePlugins(plugins: string[], settings: ISettings) {
  const insidePlugins = await fs.promises.readdir(path.join(__dirname, "../../../..", "plugins"));
  for (const folder of insidePlugins) {
    const fullPath = path.join(__dirname, "../../../..", "plugins", folder);
    const getPackage = await Plugin.getPackageAsync(fullPath).catch(() => null);

    if (getPackage) {
      const isInstalled = settings.installed_plugins?.includes(md5(getPackage.name));
      const isInstalledDatabasePlugin = settings.database_plugin?.split(":")[0] === md5(getPackage.name);
      const isDatabase = getPackage?.tcore?.types?.includes("database");
      const isStore = getPackage?.tcore?.store;

      if (isInstalled || isInstalledDatabasePlugin || (isDatabase && !settings.database_plugin) || isStore) {
        plugins.push(fullPath);
      }
    }
  }
}

/**
 * Lists all the plugins directly from the folder.
 */
export async function getPluginList(): Promise<any> {
  const folders = await listPluginFolders();
  const result: any = [];

  for (const folder of folders) {
    const pkg = await Plugin.getPackageAsync(folder).catch(() => null);
    if (pkg) {
      const object = {
        folder,
        id: Plugin.generatePluginID(pkg.name),
        manifest: pkg.tcore,
        name: pkg.tcore?.name || "",
        version: pkg.version,
      };

      result.push(object);
    }
  }

  return result;
}

/**
 * Lists all the plugins directly main plugin folder.
 */
export async function getAllInsidePlugins() {
  const insidePlugins = await fs.promises.readdir(path.join(__dirname, "../../../..", "plugins"));
  const list: IPluginPackage[] = [];
  for (const folder of insidePlugins) {
    const fullPath = path.join(__dirname, "../../../..", "plugins", folder);
    const pluginPackage = await Plugin.getPackageAsync(fullPath).catch(() => null);

    if (pluginPackage) {
      const isStore = pluginPackage?.tcore?.store;

      if (!isStore) {
        list.push({
          name: pluginPackage.tcore.name,
          id: md5(pluginPackage.name),
          version: pluginPackage.version,
          short_description: pluginPackage.tcore.short_description,
          full_description_url: await Plugin.returnFullDescription(fullPath, pluginPackage.tcore.full_description),
          logo_url: "",
          fullPath: fullPath,
          publisher: {
            name: pluginPackage.tcore.publisher.name,
            domain: pluginPackage.tcore.publisher.domain,
            __typename: "PluginPublisher",
          },
          __typename: "PluginListItem",
        });
      }
    }
  }

  return list;
}

/**
 * Get a list of ids of all installed plugins.
 */
export async function getAllInstalledPlugins() {
  const settings = await getMainSettings();
  const isInstalledDatabasePlugin = settings.database_plugin?.split(":")[0];
  const list = settings.installed_plugins || [];
  if (isInstalledDatabasePlugin) {
    list.push(isInstalledDatabasePlugin);
  }
  return list;
}

/**
 * Activate a plugin by it's ID.
 */
export async function activatePlugin(pluginID: string) {
  const settings = await getMainSettings();

  if (!settings.installed_plugins) {
    settings.installed_plugins = [];
  }
  if (!settings.installed_plugins.includes(pluginID)) {
    settings.installed_plugins.push(pluginID);
    await setMainSettings(settings);
    const plugins = await getAllInsidePlugins();
    const plugin = plugins.find((x: any) => x.id === pluginID);
    if (plugin) {
      await startPluginAndHandleErrors(plugin.fullPath);
    }
    console.log(`Plugin ${pluginID} activated`);
  }
  return true;
}

/**
 * Deactivate a plugin by it's ID.
 */
export async function deactivatePlugin(pluginID: string) {
  const settings = await getMainSettings();

  if (settings.installed_plugins?.includes(pluginID)) {
    settings.installed_plugins = settings.installed_plugins.filter((id) => id !== pluginID);
    await setMainSettings(settings);
    const plugins = await getAllInsidePlugins();
    const plugin = plugins.find((x: any) => x.id === pluginID);
    if (plugin) {
      const stopPlugin = new Plugin(plugin.fullPath);
      await stopPlugin.stop(true, 3000).catch(() => null);
    }
    console.log(`Plugin ${pluginID} deactivated`);
  }
  return true;
}

/**
 * Indicates if there is at least one COMPATIBLE database plugin installed.
 */
export async function hasDBPluginInstalled(): Promise<boolean> {
  const folders = await listPluginFolders();

  for (const folder of folders) {
    const pkg = await Plugin.getPackageAsync(folder).catch(() => null);
    if (pkg) {
      const pluginEngineVersion = pkg?.engines?.tcore || "*";
      const isDatabase = pkg?.tcore?.types?.includes("database");
      const compatible = semver.satisfies(getVersion(), pluginEngineVersion);
      if (isDatabase && compatible) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Lists all the plugins.
 */
export async function getAllPluginList(): Promise<any> {
  const settings = await getMainSettings();
  const folders = await fs.promises.readdir(settings.plugin_folder);
  const result: any = [];

  for (const id of folders) {
    const pkg = await Plugin.getPackageAsync(path.join(settings.plugin_folder, id)).catch(() => null);
    if (!pkg) {
      continue;
    }

    const pluginID = Plugin.generatePluginID(pkg.name) as string;
    const plugin = plugins.get(pluginID);
    const modules = [...(plugin?.modules?.values?.() || [])];

    const object: any = {
      id: pluginID,
      name: pkg.tcore?.name || "",
      version: pkg.version,
      modules: modules.map((x) => ({
        error: x.error,
        id: x.setup?.id,
        name: x.setup?.name,
        state: x.state,
        type: x.setup?.type,
      })),
    };

    result.push(object);
  }

  return result;
}

export async function showModuleMessage(pluginID: string, moduleID: string, message?: any) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    module.message = message;
    module.emitSocketUpdate();
  }
}

/**
 * Checks if we should trigger the `onMainDatabaseModuleLoaded` hook, and if
 * we should, we trigger it.
 */
export async function checkMainDatabaseModuleHook() {
  const mainSettings = await getMainSettings();
  const split = String(mainSettings.database_plugin).split(":");
  const plugin = plugins.get(split[0]);
  const module = plugin?.modules?.get(split[1]);
  const mainDatabaseIsLoaded = mainSettings.database_plugin && plugin && module?.state === "started";
  if (mainDatabaseIsLoaded) {
    triggerHooks("onMainDatabaseModuleLoaded");
  }
}

/**
 * Hides a message from a module in the plugin's configuration.
 */
export async function hideModuleMessage(pluginID: string, moduleID: string) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    module.message = null;
    module.emitSocketUpdate();
  }
}

/**
 * Starts/restarts a plugin module.
 */
export async function startPluginModule(pluginID: string, moduleID: string) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    await module.start();
  }
}

/**
 */
export async function reloadPlugin(id: string) {
  const plugin = plugins.get(id);

  if (plugin) {
    if (plugin.state !== "started") {
      await plugin.start();
    }

    const modules = [...plugin.modules.values()];
    for (const mod of modules) {
      await startPluginModule(id, mod.id);
    }
  }
}

/**
 * Stops a plugin module.
 */
export async function stopPluginModule(pluginID: string, moduleID: string) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    await module.stop();
  }
}

/**
 * Enables a plugin (if not enabled yet).
 */
export async function enablePlugin(pluginID: string) {
  const plugin = plugins.get(pluginID);
  if (plugin) {
    await plugin.enable();
  }
}

/**
 * Disables a plugin (if not disabled yet).
 */
export async function disablePlugin(pluginID: string) {
  const plugin = plugins.get(pluginID);
  if (plugin) {
    await plugin.disable();
  }
}

/**
 * Starts a plugin (if not started yet).
 */
export async function startPlugin(pluginID: string) {
  const plugin = plugins.get(pluginID);
  if (plugin) {
    await plugin.start();
  }
}

/**
 * Stops a plugin (if not Stopped yet).
 */
export async function stopPlugin(pluginID: string) {
  const plugin = plugins.get(pluginID);
  if (plugin) {
    await plugin.stop();
  }
}

/**
 * Retrieves all the information of a single plugin.
 */
export async function getPluginInfo(id: TGenericID): Promise<IPlugin | null> {
  const plugin = plugins.get(id);
  if (!plugin) {
    throw new Error("Invalid Plugin ID");
  }

  const mainSettings = await getMainSettings();
  const settings = await getPluginSettings(id);

  const modules = [...plugin.modules.values()].map((module) => {
    const moduleSettings = settings?.modules?.find((y) => y.id === module.setup.id);
    const moduleValues = moduleSettings?.values || {};

    const moduleFields = flattenConfigFields(module.setup.configs || []);
    for (const field of moduleFields) {
      // we override the default value of the config field to use the last
      // inserted value or the actual default from the module configuration
      if ("field" in field) {
        if (moduleValues[field.field] !== null && moduleValues[field.field] !== undefined) {
          (field as any).defaultValue = moduleValues[field.field];
        } else if ((field as any).defaultValue === undefined || (field as any).defaultValue === null) {
          (field as any).defaultValue = "";
        }
      }
    }

    return {
      ...module.setup,
      error: module.error,
      message: module.message,
      state: module.state,
    };
  });

  const dbPluginID = String(mainSettings.database_plugin).split(":")[0];
  const allow_disable = dbPluginID !== id;
  const allow_uninstall = dbPluginID !== id;

  const data: IPlugin = {
    id: plugin.id,
    error: plugin.error,
    short_description: plugin.description,
    full_description: plugin.fullDescription || "",
    name: plugin.tcoreName,
    state: plugin.state,
    slug: plugin.packageName,
    publisher: plugin.publisher,
    modules,
    version: plugin.version,
    allow_disable,
    allow_uninstall,
  };

  return data;
}

/**
 * Finds and returns the main database plugin.
 */
export async function getMainDatabaseModule(): Promise<Module | null> {
  const settings = await getMainSettings();
  const pluginID = String(settings.database_plugin).split(":")?.[0];
  const moduleID = String(settings.database_plugin).split(":")?.[1];

  if (pluginID && moduleID) {
    // main database plugin was informed, we'll use that
    const plugin = plugins.get(pluginID);
    if (plugin) {
      const module = plugin.modules.get(moduleID);
      if (module) {
        return module;
      }
    }
  }

  return null;
}

/**
 * Finds and returns the main queue plugin.
 */
export async function getMainQueueModule(): Promise<Module | null> {
  const settings = await getMainSettings();
  const [pluginID, moduleID] = String(settings.queue_plugin).split(":");

  if (pluginID && moduleID) {
    const plugin = plugins.get(pluginID);
    if (plugin) {
      const module = plugin.modules.get(moduleID);

      if (module?.state === "started") {
        return module;
      }
    }
  }

  return null;
}

/**
 * TODO
 */
export async function getMainFilesystemModule(): Promise<Module | null | undefined> {
  const settings = await getMainSettings();
  const pluginID = String(settings.filesystem_plugin).split(":")?.[0];
  const moduleID = String(settings.filesystem_plugin).split(":")?.[1];

  if (pluginID && moduleID) {
    // main plugin was informed, we'll use that
    const module = plugins.get(pluginID)?.modules?.get(moduleID);
    if (module?.state === "started") {
      return module;
    } else {
      return null;
    }
  }

  return undefined;
}

/**
 * Lists modules from the plugins.
 * @param {TPluginType} type - optional type to filter the modules.
 */
export function getModuleList(type?: TPluginType | null): Module[] {
  const result: Module[] = [];

  for (const plugin of plugins.values()) {
    for (const module of plugin.modules.values()) {
      if (!type || module.setup.type === type) {
        result.push(module);
      }
    }
  }

  return result;
}

/**
 */
export function getPluginModuleInfo(pluginID: string, moduleID: string): any {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    return {
      state: module?.state,
      error: module?.error,
    };
  }
}

/**
 * Invokes a plugin module's onCall function.
 */
export async function invokeOnCallModule(pluginID: string, moduleID: string, data?: any) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (!module) {
    throw new Error("Plugin or module not found");
  }
  return await module.invokeOnCall(data);
}

/**
 * Triggers all hook modules with a certain event.
 */
export function triggerHooks(event: string, ...args: any[]) {
  const hooks = getModuleList("hook");
  for (const mod of hooks) {
    mod.invoke(event, ...args).catch(() => null);
  }
}

/**
 * Terminates all running plugins.
 */
export async function terminateAllPlugins(ignoreBuiltIns = true) {
  const result: Plugin[] = [];

  for (const plugin of plugins.values()) {
    if (plugin.types.includes("database")) {
      result.unshift(plugin);
    } else {
      result.push(plugin);
    }
  }

  for (const plugin of result) {
    if (ignoreBuiltIns && plugin.builtIn) {
      continue;
    }

    // eslint-disable-next-line no-async-promise-executor
    await new Promise<void>(async (resolve) => {
      await plugin.stop(false, 3000).catch(() => null);
      plugins.delete(plugin.id);
      resolve();
    });
  }
}
