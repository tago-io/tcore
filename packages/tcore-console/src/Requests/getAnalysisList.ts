import { Account } from "@tago-io/sdk";
import { AnalysisQuery } from "@tago-io/sdk/out/modules/Account/analysis.types";
import { IAnalysis } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 * Retrieves a list of analyses.
 */
async function getAnalysisList(page: number, amount: number, filter: any): Promise<IAnalysis[]> {
  const query = {
    page,
    amount,
    filter: {
      active: filter.active ?? undefined,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: ["name", "active", "last_run", "created_at"],
  };

  const account = new Account({ token: store.token });
  const result = await account.analysis.list(query as AnalysisQuery);
  return result as unknown as IAnalysis[];
}

export default getAnalysisList;
