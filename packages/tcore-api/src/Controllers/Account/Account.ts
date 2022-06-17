import { Application } from "express";
import { createAccount, getAccountAmount, getAccountByToken, getAccountList, login } from "../../Services/Account/Account";
import { z } from "zod";
import APIController, { ISetupController, warm } from "../APIController";
import { IAccountCreate, zAccountCreate } from "@tago-io/tcore-sdk/types";

const zAccountLoginBody = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * Lists all the database plugins.
 */
class AccountLogin extends APIController<z.infer<typeof zAccountLoginBody>, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
    zBodyParser: zAccountLoginBody,
  };

  public async main() {
    const { username, password } = this.bodyParams;
    const response = await login(username, password);
    this.body = response;
  }
}

/**
 * Checks if there is at least one account registered.
 */
class CheckAccountStatus extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
  };

  public async main() {
    const amount = await getAccountAmount();
    this.body = amount > 0;
  }
}

/**
 * Checks if there is at least one account registered.
 */
class InfoAccount extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getAccountByToken(this.rawToken as string);
    this.body = response;
  }
}

/**
 * Creates a new device.
 */
class CreateAccount extends APIController<IAccountCreate, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
    zBodyParser: zAccountCreate,
  };

  public async main() {
    const response = await createAccount(this.bodyParams);
    this.body = response;
  }
}

/**
 * Exports the auth routes.
 */
export default (app: Application) => {
  app.get("/account", warm(InfoAccount));
  app.get("/account/status", warm(CheckAccountStatus));
  app.post("/account", warm(CreateAccount));
  app.post("/account/login", warm(AccountLogin));
};
