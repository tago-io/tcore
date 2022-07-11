import path from "path";
import * as API from "@tago-io/tcore-api";
import { Command } from "commander";

/**
 * Try to require a module and returns null if the module doesn't exist.
 */
function tryRequire(folder: string) {
  try {
    return require(folder);
  } catch (ex) {
    return null;
  }
}

/**
 * Adds plugin commands to the CLI.
 */
async function addPluginCommands(program: Command) {
  const list = await API.getPluginList();

  for (const item of list) {
    const commands = item.manifest?.cli?.commands || [];

    for (const pluginCommand of commands) {
      if (!pluginCommand || !pluginCommand.name) {
        continue;
      }

      const commandName = pluginCommand.name;
      const commandDesc = pluginCommand.description || "";
      const commandOpts = pluginCommand.options || [];
      const commandArgs = pluginCommand.arguments || [];
      const cliCommand = program.command(commandName).description(commandDesc);

      for (const arg of commandArgs) {
        cliCommand.argument(arg.flags, arg.description);
      }
      for (const option of commandOpts) {
        cliCommand.option(option.flags, option.description);
      }

      const folder = path.join(item.folder, pluginCommand.file);
      const fileData = tryRequire(folder);

      if (fileData) {
        const handler = fileData[pluginCommand.handler] || fileData.default?.[pluginCommand.handler];
        if (typeof handler === "function") {
          cliCommand.action(handler);
        }
      }
    }
  }
}

export { addPluginCommands };
