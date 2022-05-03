import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function enablePlugin(id: TGenericID) {
  await axios.post(`/plugin/${id}/enable`);
}

export default enablePlugin;
