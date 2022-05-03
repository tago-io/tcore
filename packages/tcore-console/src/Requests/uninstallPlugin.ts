import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function uninstallPlugin(id: TGenericID, keepData?: boolean) {
  await axios.get(`/plugin-uninstall/${id}?keep_data=${keepData}`);
}

export default uninstallPlugin;
