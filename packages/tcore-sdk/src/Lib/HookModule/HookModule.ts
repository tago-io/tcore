import { TGenericID, IModuleSetupWithoutType, IDeviceData } from "../../Types";
import TCoreModule from "../TCoreModule/TCoreModule";

/**
 * This module allows the creation of listener events when certain situations
 * happen in the application.
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
}

export default HookModule;
