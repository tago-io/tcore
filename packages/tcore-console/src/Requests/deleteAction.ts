import { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function deleteAction(id: TGenericID): Promise<void> {
  await axios.delete(`/action/${id}`);
}

export default deleteAction;
