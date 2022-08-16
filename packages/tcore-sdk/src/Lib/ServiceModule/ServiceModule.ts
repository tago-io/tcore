import { IModuleSetupWithoutType } from "../../Types";
import TCoreModule from "../TCoreModule/TCoreModule";

/**
 * This module allows the creation of a service that runs code.
 */
class ServiceModule<T = any> extends TCoreModule<T> {
  constructor(setup: IModuleSetupWithoutType) {
    super(setup, "service");
  }

  /**
   * Custom code implementation.
   */
  public async onCall(...args: any[]): Promise<any> {
    return Promise.resolve();
  }
}

export default ServiceModule;
