import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function disablePlugin(id: TGenericID) {
  await axios.post(`/plugin/${id}/disable`);
}

export default disablePlugin;
