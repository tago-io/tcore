/* eslint-disable no-async-promise-executor */
import { Server } from "http";
import { getSystemName } from "@tago-io/tcore-shared";
import { stopActionScheduleTimer } from "../Services/ActionScheduler";
import { plugins } from "../Plugins/Host";
import Plugin from "../Plugins/Plugin/Plugin";
import { log } from "./log";

let shutdownTries = 0;

/**
 * Shuts down the server, all plugins, and then the application.
 */
export async function shutdown(httpServer: Server) {
  stopActionScheduleTimer();

  log("api", `Shutting down ${getSystemName()} (${shutdownTries + 1}/3 tries)`);

  // increase the shutdown tries
  shutdownTries += 1;

  // first we close the server before closing any plugins
  httpServer.close();

  if (shutdownTries >= 3) {
    // forcefully exit
    log("api", "Terminated with exit code 1");
    process.exit(1);
  }

  const sortedPlugins = await sortPluginsByPriority();
  for (const plugin of sortedPlugins) {
    await destroyPlugin(plugin);
  }

  log("api", "Terminated with exit code 0");
  process.exit(0);
}

/**
 * Destroys a plugin.
 * This will return the flow back to the main function only when the plugin calls the `destroy` event.
 */
async function destroyPlugin(plugin: Plugin) {
  return new Promise<void>(async (resolve) => {
    await plugin.stop(false, 3000).catch(() => null);
    resolve();
  });
}

/**
 * Sorts the plugins by priority:
 * First all the other plugins then the main database one.
 */
async function sortPluginsByPriority() {
  const result: Plugin[] = [];

  for (const plugin of plugins.values()) {
    if (plugin.types.includes("database")) {
      result.unshift(plugin);
    } else {
      result.push(plugin);
    }
  }

  return result;
}
