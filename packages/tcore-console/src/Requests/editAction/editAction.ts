import { Account } from "@tago-io/sdk";
import { ActionCreateInfo } from "@tago-io/sdk/out/modules/Account/actions.types";
import { IActionEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../../System/Store";

/**
 */
async function editAction(id: TGenericID, data: IActionEdit): Promise<void> {
  const account = new Account({ token: store.token });
  await account.actions.edit(id, data as Partial<ActionCreateInfo>);
}

export default editAction;
