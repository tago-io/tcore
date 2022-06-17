import fs from "fs";
import path from "path";
import { Application } from "express";
// @ts-ignore
import pkg from "../../../../package.json";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Retrieves the status information.
 */
class GetStatus extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
  };

  public async main() {
    const version = pkg.version;
    this.body = { version };
  }
}

/**
 * Retrieves the changelog information.
 */
class GetChangelog extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
  };

  public async main() {
    const changelogPath = path.join(__dirname, "../../../../CHANGELOG.md");
    const changelogMD = await fs.promises.readFile(changelogPath);

    this.useBodyWrapper = false;
    this.res.set("Content-Type", "text/plain");
    this.body = changelogMD;
  }
}

/**
 * Exports the routes of the system.
 */
export default (app: Application) => {
  app.get("/status", warm(GetStatus));
  app.get("/changelog", warm(GetChangelog));
};
