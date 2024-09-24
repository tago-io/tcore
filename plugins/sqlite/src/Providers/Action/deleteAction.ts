import { TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex";

/**
 * Deletes an action.
 */
async function deleteAction(actionID: TGenericID): Promise<void> {
  await knexClient.delete().from("action").where("id", actionID);
}

export default deleteAction;
