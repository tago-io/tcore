import { Application } from "express";
import { getHourlyStatistics } from "../Services/Statistic/Statistic";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Retrieves all statistics from the last hour.
 */
class GetHourlyStatistic extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getHourlyStatistics();
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/statistics", warm(GetHourlyStatistic));
};
