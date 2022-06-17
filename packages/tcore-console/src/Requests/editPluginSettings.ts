import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store";

/**
 */
async function editPluginSettings(id: TGenericID, data: any) {
  await axios.put(`/plugin/${id}`, data, { headers: { token: store.token } });
}

export default editPluginSettings;
