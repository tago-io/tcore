import { Application } from "express";
import { getPlatformAndArch } from "../Helpers/Platform";
import { getComputerUsage, getNetworkInfo, getOSInfo } from "../Services/Hardware";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Retrieves some of the information of the operational system.
 */
class GetOSInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = await getOSInfo();
    this.body = response;
  }
}

/**
 * Retrieves some of the information of the network.
 */
class GetNetworkInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = await getNetworkInfo();
    this.body = response;
  }
}

/**
 * Retrieves the platform and arch for this computer.
 */
class GetPlatformInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = getPlatformAndArch();
    this.body = response;
  }
}

/**
 * Retrieves the usage of this computer.
 */
class GetUsageInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = await getComputerUsage();
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/hardware/os", warm(GetOSInfo));
  app.get("/hardware/usage", warm(GetUsageInfo));
  app.get("/hardware/network", warm(GetNetworkInfo));
  app.get("/hardware/platform", warm(GetPlatformInfo));
};
