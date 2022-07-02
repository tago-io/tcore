import axios from "axios";
import { PLUGIN_STORE_PLUGIN_ID } from "../Constants";
import store from "../System/Store";

/**
 */
async function getPluginStoreInstallURLs(id: string, version: string): Promise<any[]> {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  const data = { id, version };
  const url = `/plugin/${PLUGIN_STORE_PLUGIN_ID}/get-install-urls/call`;
  const response = await axios.post(url, data, { headers });
  return response.data.result;
}

export default getPluginStoreInstallURLs;
