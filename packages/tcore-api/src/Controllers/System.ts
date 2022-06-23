import { Application } from "express";
import { getStatus } from "../Services/System";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Retrieves the status information.
 */
class GetStatus extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
  };

  public async main() {
    const response = await getStatus();
    this.body = response;
  }
}

/**
 * Exports the routes of the system.
 */
export default (app: Application) => {
  app.get("/status", warm(GetStatus));
};
