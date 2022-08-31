import fs from "fs";
import path from "path";
import { io } from "../Socket/SocketServer";
import { getMainSettings, getPluginSettingsFolder } from "../Services/Settings/Settings";
import { plugins } from "./Host";

/**
 * Uninstalls a plugin.
 */
export async function uninstallPlugin(id: string, keepPluginData?: boolean) {
  const plugin = plugins.get(id);
  let pluginFolder = "";

  if (plugin) {
    // plugin is currently loaded, we will stop it and acquire its folder
    // to delete it.
    await plugin.stop(false, 3000).catch(() => null);
    pluginFolder = plugin.folder;
    plugins.delete(id);
  }

  if (!pluginFolder) {
    // plugin folder wasn't found in the loaded plugin, we will manually
    // remove the folder from the plugin folder settings combined with the
    // current plugin id.
    const settings = await getMainSettings();
    pluginFolder = path.join(settings.plugin_folder, id);
  }

  if (!pluginFolder) {
    // somehow we still don't have a folder to delete, ignore it.
    return;
  }

  // remove the plugin folder
  await rmdir(pluginFolder);

  if (!keepPluginData) {
    const settingsFolder = await getPluginSettingsFolder(id);
    await rmdir(settingsFolder);
  }

  const socketData = {
    id: id,
    deleted: true,
  };

  io?.to(`plugin#${id}`).emit("plugin::sidebar", socketData);
  io?.to(`plugin#${id}`).emit("plugin::status", socketData);
}

/**
 * Uninstalls a plugin.
 */
export async function uninstallPluginByFolder(folder: string) {
  await rmdir(folder);
}

/**
 * Removes directory recursively.
 */
async function rmdir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  if (!dir || dir === "/") {
    return;
  }

  const list = await fs.promises.readdir(dir);
  for (let i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (filename == "." || filename == "..") {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      await rmdir(filename);
    } else {
      // rm filename
      await fs.promises.unlink(filename);
    }
  }

  await fs.promises.rmdir(dir);
}
