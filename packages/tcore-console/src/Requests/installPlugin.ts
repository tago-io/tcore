import axios from "axios";
import store from "../System/Store";

/**
 */
async function installPlugin(source: string): Promise<void> {
  const headers = { token: store.token };
  const response = await axios.post("/install-plugin", { source }, { headers });
  const { data } = response;
  return data.result;
}

export default installPlugin;
