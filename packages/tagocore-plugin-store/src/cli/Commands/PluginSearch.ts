import chalk from "chalk";
import { oraLog } from "../Helpers/Log";
import { searchPluginStore } from "../Helpers/PluginStore";
import { printTable } from "../Helpers/Table";

/**
 * Searches plugins by name, slug, or id.
 * Prints all found plugins in a tabular way.
 */
export async function searchPlugins(identifier: string) {
  const initial = `Searching plugins with filter ${chalk.yellow(identifier)}`;
  const spinner = oraLog(initial);

  const fields = ["id", "name", "version"];
  const plugins = await searchPluginStore(identifier, fields);

  spinner.succeed(`${initial} - ${plugins.length} found`);

  printTable(plugins);
}
