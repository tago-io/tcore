import { IActionCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 */
async function createAction(action: Omit<IActionCreate, "id" | "created_at">): Promise<TGenericID> {
  const response = await axios.post("/action", action);
  const { data } = response;
  return data.result;
}

export default createAction;
