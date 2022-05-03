import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function startPluginModule(id: TGenericID, moduleID: any) {
  await axios.post(`/plugin/${id}/${moduleID}/start`);
}

export default startPluginModule;
