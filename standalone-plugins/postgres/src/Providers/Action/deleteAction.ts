import { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Deletes an action.
 */
async function deleteAction(actionID: TGenericID): Promise<void> {
  await mainDB.write.delete().from("action").where("id", actionID);
}

export default deleteAction;
