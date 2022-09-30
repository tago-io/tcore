import { IDatabaseDeviceDataCreate, IModuleSetupWithoutType, TGenericID, TDeviceType } from "../../Types";
import TCoreModule from "../TCoreModule/TCoreModule";

/**
 * This module allows the creation of a new queue plugin.
 */
class QueueModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "queue");
  }

  /**
   * Trigger this function when data added to device.
   * The data is already parsed and encoded.
   */
  public async onAddDeviceData(deviceID: TGenericID, data: IDatabaseDeviceDataCreate[]): Promise<void> {
    throw new Error("Method not implemented");
  }
}

export default QueueModule;
