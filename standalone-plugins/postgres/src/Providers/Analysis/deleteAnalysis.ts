import { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Deletes an analysis.
 */
async function deleteAnalysis(analysisID: TGenericID): Promise<void> {
  await mainDB.write.delete().from("analysis").where("id", analysisID);
}

export default deleteAnalysis;
