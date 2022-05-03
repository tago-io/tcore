import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function stopPluginModule(id: TGenericID, moduleID: any) {
  await axios.post(`/plugin/${id}/${moduleID}/stop`);
}

export default stopPluginModule;
