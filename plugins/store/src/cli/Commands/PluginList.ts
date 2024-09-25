import * as API from "@tago-io/tcore-api";
import { printTable } from "../Helpers/Table";

/**
 * Array of data to show in a table.
 */
interface IPluginData {
  id: string;
  name: string;
  slug: string;
  version: string;
  disabled: boolean;
}

/**
 * Lists all installed plugins in a tabular way.
 */
export async function listPlugins() {
  const plugins = await API.listPluginFolders();
  const data: IPluginData[] = [];

  for (const folder of plugins) {
    const pluginPkg = await getPackage(folder).catch(() => null);
    if (pluginPkg?.tcore) {
      const pluginID = API.Plugin.generatePluginID(pluginPkg.name);
      const si = await API.getPluginSettings(pluginID);
      data.push({
        id: pluginID,
        name: pluginPkg.tcore.name,
        slug: pluginPkg.name,
        disabled: si.disabled || false,
        version: `v${pluginPkg.version}`,
      });
    }
  }

  printTable(data);
}

/**
 * Gets package async.
 */
async function getPackage(folder: string) {
  return API.Plugin.getPackage(folder);
}

