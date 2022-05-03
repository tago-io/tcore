import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function deleteAnalysis(id: TGenericID): Promise<void> {
  await axios.delete(`/analysis/${id}`);
}

export default deleteAnalysis;
