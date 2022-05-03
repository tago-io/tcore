import { ISummary, zSummary } from "@tago-io/tcore-sdk/types";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction";

/**
 * Retrieves the summary information.
 */
export async function getSummary(): Promise<ISummary> {
  const response = await invokeDatabaseFunction("getSummary");
  const parsed = await zSummary.parseAsync(response);
  return parsed;
}
