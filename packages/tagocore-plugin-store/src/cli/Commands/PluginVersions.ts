import chalk from "chalk";
import { log, oraLog } from "../Helpers/Log";
import { getStorePluginInfo } from "../Helpers/PluginStore";

/**
 * Lists all versions of a single plugin.
 */
export async function listPluginsVersions(identifier: string) {
  const spinner = oraLog(identifier);

  try {
    const fields = ["versions"];
    const plugin = await getStorePluginInfo(identifier, fields);

    spinner.succeed();

    log(plugin.versions);
  } catch (ex: any) {
    spinner.fail(`${identifier} - ${chalk.redBright(ex?.message || ex)}`);
  }
}
