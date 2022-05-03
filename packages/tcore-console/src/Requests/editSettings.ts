import { ISettings } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function editSettings(data: ISettings): Promise<void> {
  await axios.put("/settings", data);
}

export default editSettings;
