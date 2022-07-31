import { TGenericID, IModuleSetupWithoutType, IDeviceData } from "../../Types";
import TCoreModule from "../TCoreModule/TCoreModule";

/**
 * This module allows the creation of listener functions that are triggered
 * when certain events happen in the application.
 */
class HookModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "hook");
  }

  /**
   * Called after the data sent by a device is inserted into the bucket.
   */
  public async onAfterInsertDeviceData(deviceID: TGenericID, data: IDeviceData[]): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Called after the data sent by a device was edited in the bucket.
   */
  public async onAfterEditDeviceData(deviceID: TGenericID, data: IDeviceData[]): Promise<void> {
    throw new Error("Method not implemented");
  }
}

export default HookModule;
