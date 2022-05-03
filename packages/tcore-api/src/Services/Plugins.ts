import fs from "fs";
import path from "path";
import { IPlugin, TGenericID, TPluginType, IPluginList } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import Module from "../Plugins/Module/Module";
import { BUILT_IN_PLUGINS, plugins } from "../Plugins/Host";
import Plugin from "../Plugins/Plugin/Plugin";
import { getMainSettings, getPluginSettings } from "./Settings";

/**
 * Lists all the plugins that are loaded.
 */
export async function getLoadedPluginList(): Promise<IPluginList> {
  const result: IPluginList = [];

  for (const plugin of plugins.values()) {
    const buttonModules = [...plugin.modules.values()].filter(
      (x) => x.setup.type === "sidebar-button" || x.setup.type === "navbar-button"
    );
    const error = !!plugin.error || [...plugin.modules.values()].some((x) => x.error);

    const buttons = buttonModules.map((x: any) => ({
      type: x.setup.type,
      color: x.setup.color,
      icon: x.setup.icon,
      name: x.setup.name,
      route: x.setup.route,
    }));

    const object = {
      buttons: buttons.length > 0 ? buttons : [],
      error: error,
      hidden: plugin.package.tcore.hidden || false,
      id: plugin.id,
      name: plugin.tcoreName,
      state: plugin.state,
      version: plugin.version,
    };

    result.push(object);
  }

  return result;
}

/**
 */
export async function listPluginFolders(): Promise<string[]> {
  const settings = await getMainSettings();
  const root = settings.plugin_folder || "";
  const folders = await fs.promises.readdir(root);
  const plugins: string[] = [];

  for (const folder of folders) {
    const fullPath = path.join(root, folder);
    const hasPackage = await Plugin.getPackageAsync(fullPath).catch(() => null);
    if (hasPackage) {
      plugins.push(fullPath);
    }
  }

  for (const item of BUILT_IN_PLUGINS) {
    if (!plugins.includes(item)) {
      plugins.unshift(item);
    }
  }

  return plugins;
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

export async function showModuleMessage(pluginID: string, moduleID: string, message?: any) {
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  if (module) {
    module.message = message;
    module.emitSocketUpdate();
  }
}

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

  const data: IPlugin = {
    id: plugin.id,
    error: plugin.error,
    short_description: plugin.description,
    full_description: plugin.fullDescription || "",
    name: plugin.tcoreName,
    state: plugin.state,
    slug: plugin.packageName,
    publisher: {
      name: plugin.publisher,
    },
    modules,
    version: plugin.version,
  };

  return data;
}

/**
 * Finds and returns the main database plugin.
 */
export async function getMainDatabaseModule(): Promise<Module | undefined> {
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

  const modules = getModuleList("database");
  return modules.find((x) => x.state === "started");
}

/**
 * TODO
 */
export async function getMainFilesystemModule(): Promise<Module | undefined> {
  const settings = await getMainSettings();
  const pluginID = String(settings.filesystem_plugin).split(":")?.[0];
  const moduleID = String(settings.filesystem_plugin).split(":")?.[1];

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

  const modules = getModuleList("filesystem");
  return modules.find((x) => x.state === "started");
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
