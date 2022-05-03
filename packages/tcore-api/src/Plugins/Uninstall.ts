import fs from "fs";
import path from "path";
import { ESocketRoom } from "@tago-io/tcore-sdk/types";
import { io } from "../Socket/SocketServer";
import { getPluginSettingsFolder } from "../Services/Settings";
import { plugins } from "./Host";

/**
 * Uninstalls a plugin.
 */
export async function uninstallPlugin(id: string, keepPluginData?: boolean) {
  const plugin = plugins.get(id);
  if (plugin) {
    await plugin.stop(false, 3000).catch(() => null);
    await rmdir(plugin.folder);
    plugins.delete(id);

    if (!keepPluginData) {
      const settingsFolder = await getPluginSettingsFolder(id);
      await rmdir(settingsFolder);
    }

    const socketData = {
      id: id,
      deleted: true,
    };

    io?.to(`${ESocketRoom.plugin}#${id}`).emit("plugin:sidebar", socketData);
    io?.to(`${ESocketRoom.plugin}#${id}`).emit("plugin:status", socketData);
  }
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
