import axios from "axios";

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
  const query = `
    query {
      pluginList {
        name
        id
        version
        short_description
        logo_url
        publisher {
          name
          domain
        }
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  if (response.data.errors) {
    const message = response.data.errors[0].message;
    throw new Error(message);
  }

  const list = response.data.data.pluginList;

  // TODO fix this when new database is released
  // currently we cant filter database plugins just yet so they
  // are static in here

  const filtered = list.filter((x: any) =>
    String(x.name).toLowerCase().includes("mysql")
    || String(x.name).toLowerCase().includes("postgres")
  );
  return filtered;
}
