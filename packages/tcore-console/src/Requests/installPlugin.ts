import axios from "axios";

/**
 */
async function installPlugin(source: string): Promise<void> {
  const response = await axios.post("/install-plugin", { source });
  const { data } = response;
  return data.result;
}

export default installPlugin;
