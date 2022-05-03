import { ISettings, zSettings } from "@tago-io/tcore-sdk/types";
import { Application } from "express";
import { getMainSettings, setMainSettings } from "../Services/Settings";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Edits the settings.
 */
class EditSettings extends APIController<ISettings, void, void> {
  setup: ISetupController = {
    allowTokens: [],
    zBodyParser: zSettings,
  };

  public async main() {
    await setMainSettings(this.bodyParams);
  }
}

/**
 * Retrieves all the information of the settings.
 */
class GetSettingsInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const settings = await getMainSettings();
    this.body = {
      settings,
      metadata: {
        database_plugin_disabled: !!process.env.TCORE_DATABASE_PLUGIN,
        plugin_folder_disabled: !!process.env.TCORE_PLUGIN_FOLDER,
        port_disabled: !!process.env.TCORE_PORT,
      },
    };
  }
}

/**
 * Exports the routes of the device.
 */
export default (app: Application) => {
  app.put("/settings", warm(EditSettings));
  app.get("/settings", warm(GetSettingsInfo));
};
