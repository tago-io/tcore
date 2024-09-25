import { getMainSettings, Plugin } from "@tago-io/tcore-api";
import axios from "axios";
import fs from "fs";
import path from "path";
import md5 from "md5";

/**
 * Endpoint of the graphql API.
 */
const GRAPHQL_ENDPOINT = "https://api.tagocore.com/graphql";

/**
 * Gets the install URLs for a plugin.
 */
export async function getInstallURLs(data: any) {
  const query = `
    query {
      pluginInfo(id: "${data.id}", version: "${data.version}") {
        install_urls {
          platform
          url
        }
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  const info = response.data.data.pluginInfo;
  const result = info.install_urls || [];
  return result;
}

/**
 * Gets the list of
 */
export async function getDatabaseList() {
  const list = await getAllInsidePlugins();

  // TODO fix this when new database is released
  // currently we cant filter database plugins just yet so they
  // are static in here

  const filtered = list.filter((x: any) =>
    String(x.name).toLowerCase().includes("mysql")
    || String(x.name).toLowerCase().includes("postgres")
  );
  return filtered;
}

export async function getAllInsidePlugins() {
  const settings = await getMainSettings();
  const insidePlugins = await fs.promises.readdir(path.join(__dirname, "../../..", "plugins"));
  console.log("insidePLugins", insidePlugins);
  const list = [];
  for (const folder of insidePlugins) {
    const fullPath = path.join(__dirname, "../../..", "plugins", folder);
    const pluginPackage = await Plugin.getPackageAsync(fullPath).catch(() => null);

    if (pluginPackage) {
      const isStore = pluginPackage?.tcore?.store;

      if (!isStore) {
        list.push({
          name: pluginPackage.name,
          id: md5(pluginPackage.name),
          version: pluginPackage.version,
          short_description: pluginPackage.tcore.short_description,
          logo_url: "",
          publisher: {
            name: pluginPackage.tcore.publisher.name,
            domain: pluginPackage.tcore.publisher.domain,
            __typename: "PluginPublisher"
          },
          __typename: "PluginListItem"
        });
      }
    }
  }

  return list;
}
