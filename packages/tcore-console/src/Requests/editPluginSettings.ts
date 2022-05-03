import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function editPluginSettings(id: TGenericID, data: any) {
  await axios.put(`/plugin/${id}`, data);
}

export default editPluginSettings;
