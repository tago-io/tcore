import { Account } from "@tago-io/sdk";
import { AnalysisQuery } from "@tago-io/sdk/out/modules/Account/analysis.types";
import { IAnalysis } from "@tago-io/tcore-sdk/types";

/**
 * Retrieves a list of analyses.
 */
async function getAnalysisList(page: number, amount: number, filter: any): Promise<IAnalysis[]> {
  const account = new Account({ token: "TMP_TOKEN" });
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

  const analyses = await account.analysis.list(query as AnalysisQuery);
  return analyses as any as IAnalysis[];
}

export default getAnalysisList;
