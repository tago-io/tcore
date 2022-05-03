import { Application } from "express";
import { getSummary } from "../Services/Summary";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Retrieves the summary information.
 */
class GetSummaryInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = await getSummary();
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/summary", warm(GetSummaryInfo));
};
