import { Account } from "@tago-io/sdk";
import { AnalysisInfo } from "@tago-io/sdk/out/modules/Account/analysis.types";
import { IAnalysisEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 */
async function editAnalysis(id: TGenericID, data: IAnalysisEdit): Promise<void> {
  const account = new Account({ token: store.token });
  await account.analysis.edit(id, data as Partial<AnalysisInfo>);
}

export default editAnalysis;
