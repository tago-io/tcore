import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store";

/**
 */
async function editPluginSettings(id: TGenericID, data: any) {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  await axios.put(`/plugin/${id}`, data, { headers });
}

export default editPluginSettings;
