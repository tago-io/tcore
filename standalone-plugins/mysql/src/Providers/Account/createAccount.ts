import { IDatabaseCreateAccountData } from "@tago-io/tcore-sdk/build/Types";
import { mainDB } from "../../Database";

/**
 * Creates a new account.
 */
async function createAccount(data: IDatabaseCreateAccountData): Promise<void> {
  await mainDB.write.insert(data).into("account");
}

export default createAccount;
