import { IActionEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function editAction(id: TGenericID, action: IActionEdit): Promise<void> {
  await axios.put(`/action/${id}`, action);
}

export default editAction;
