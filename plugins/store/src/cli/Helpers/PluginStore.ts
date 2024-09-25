import axios from "axios";
import * as API from "@tago-io/tcore-api";
// @ts-ignore
import pkg from "../../../package.json";

/**
 * Endpoint of the graphql API.
 */
const GRAPHQL_ENDPOINT = "https://api.tagocore.com/graphql";

/**
 */
export async function getStorePluginInfo(pluginID: string, fields: string[], version?: string) {
  const v = version ? `, version: "${version}"` : "";
  const query = `
    query {
      pluginInfo(id: "${pluginID}"${v}) {
        ${fields.join("\n")}
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  return response.data.data.pluginInfo;
}

/**
 */
export async function searchPluginStore(name: string, fields: string[]) {
  const query = `
    query {
      pluginList(filter: "${name}") {
        ${fields.join("\n")}
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  return response.data.data.pluginList;
}

/**
 */
export async function pluginStoreGetLatestCompatible(id: string, fields: string[]) {
  const query = `
    query {
      pluginLatestCompatible(id: "${id}", tagoCoreVersion: "${pkg.version}") {
        ${fields.join("\n")}
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  return response.data.data.pluginLatestCompatible;
}

/**
 */
export async function getGraphQLTagoCoreVersions(): Promise<any[]> {
  const query = `
    query {
      tagoCoreVersionList {
        released_at,
        version,
        platforms
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  return response.data.data.tagoCoreVersionList;
}

/**
 */
export function findPluginStoreInstallURL(urls: any[]): String | null {
  const plat = API.getPlatformAndArch();
  const item = urls?.find((x) => x.platform === plat || x.platform === "any");
  if (item) {
    return item.url;
  }
  return null;
}
