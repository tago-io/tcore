import { ISettings } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store";

/**
 */
async function editSettings(data: ISettings): Promise<void> {
  await axios.put("/settings", data, { headers: { token: store.token } });
}

export default editSettings;
