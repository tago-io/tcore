import path from "path";
import { Request, Response, Application } from "express";
import { z } from "zod";
import { IActionTypeModuleSetup, zPluginType } from "@tago-io/tcore-sdk/types";
import { setPluginModulesSettings } from "../Services/Settings";
import { plugins } from "../Plugins/Host";
import {
  getPluginInfo,
  getLoadedPluginList,
  getModuleList,
  startPluginModule,
  stopPluginModule,
  enablePlugin,
  disablePlugin,
  startPlugin,
  stopPlugin,
} from "../Services/Plugins";
import { installPlugin } from "../Plugins/Install";
import { uninstallPlugin } from "../Plugins/Uninstall";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Configuration for type in the query string.
 */
const zQueryStringType = z.object({
  type: zPluginType.nullish(),
});

/**
 * Configuration for query strings of the uninstall route.
 */
const zUninstallQueryString = z.object({
  keep_data: z.preprocess((e) => e === "true" || e === "1", z.boolean()).optional(),
});

type IURLParamsID = z.infer<typeof zURLParamsID>;

/**
 * Lists all the database plugins.
 */
class UninstallPlugin extends APIController<void, z.infer<typeof zUninstallQueryString>, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
    zQueryStringParser: zUninstallQueryString,
  };

  public async main() {
    const response = await uninstallPlugin(this.urlParams.id, this.queryStringParams.keep_data);
    this.body = response;
  }
}

/**
 * Lists all modules or modules from a specific type.
 */
class ListModules extends APIController<void, z.infer<typeof zQueryStringType>, void> {
  setup: ISetupController = {
    allowTokens: [],
    zQueryStringParser: zQueryStringType,
  };

  public async main() {
    const response = getModuleList(this.queryStringParams.type).map((x) => ({
      pluginID: x.plugin?.id,
      pluginName: x.plugin?.tcoreName,
      setupID: x.setup.id,
      setupName: x.setup.name,
    }));
    this.body = response;
  }
}

/**
 * Lists all the plugins.
 */
class ListPlugins extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [],
  };

  public async main() {
    const response = await getLoadedPluginList();
    this.body = response;
  }
}

/**
 * Starts/restarts a plugin module.
 */
class StartPluginModule extends APIController<void, void, any> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: z.any(),
  };

  public async main() {
    await startPluginModule(this.urlParams.pluginID, this.urlParams.moduleID);
  }
}

/**
 * Stops a plugin module.
 */
class StopPluginModule extends APIController<void, void, any> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: z.any(),
  };

  public async main() {
    await stopPluginModule(this.urlParams.pluginID, this.urlParams.moduleID);
  }
}

/**
 * Installs a plugin.
 */
class InstallPlugin extends APIController<any, void, void> {
  setup: ISetupController = {
    allowTokens: [],
    zBodyParser: z.any(),
  };

  public async main() {
    await installPlugin(this.bodyParams.source, { log: true, start: true });
  }
}

/**
 * Enables a plugin (if not enabled yet).
 */
class EnablePlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await enablePlugin(this.urlParams.id);
  }
}

/**
 * Disables a plugin (if not disabled yet).
 */
class DisablePlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await disablePlugin(this.urlParams.id);
  }
}

/**
 * Starts a plugin (if not started yet).
 */
class StartPlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await startPlugin(this.urlParams.id);
  }
}

/**
 * Stops a plugin (if not Stopped yet).
 */
class StopPlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await stopPlugin(this.urlParams.id);
  }
}

/**
 * Edits a plugin's settings.
 */
class EditPluginSettings extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
    zBodyParser: z.any(),
  };

  public async main() {
    await setPluginModulesSettings(this.urlParams.id, this.bodyParams);

    const plugin = plugins.get(this.urlParams.id);
    if (plugin && plugin?.state !== "disabled" && plugin.state !== "started") {
      await plugin.start();
    }

    const cache = {};
    for (const item of this.bodyParams) {
      if (!cache[item.moduleID]) {
        cache[item.moduleID] = true;
        await startPluginModule(this.urlParams.id, item.moduleID);
      }
    }
  }
}

/**
 * Lists all the plugins.
 */
class GetPluginInfo extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getPluginInfo(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Resolves the request for a plugin image.
 */
export async function resolvePluginImage(req: Request, res: Response) {
  const { type, identifier } = req.params;
  const plugin = plugins.get(req.params.plugin);
  const tcorePkg = plugin?.package?.tcore;
  let fullImagePath = "";

  if (plugin && tcorePkg) {
    if (type === "icon" && tcorePkg.icon) {
      // icon (thumbnail/logo) of the plugin
      fullImagePath = path.join(plugin.folder, tcorePkg.icon);
    } else if (type === "action") {
      // icon for the action type
      const module = plugin.modules.get(identifier);
      const option = (module?.setup as any as IActionTypeModuleSetup)?.option;
      fullImagePath = option?.icon?.replace("$PLUGIN_FOLDER$", plugin.folder) || "";
    }
  }

  if (fullImagePath) {
    res.sendFile(fullImagePath);
  } else {
    res.sendStatus(404);
  }
}

/**
 * Resolves the request for a plugin image.
 */
export async function resolvePluginImage2(req: Request, res: Response) {
  const split = req.path.split("/").filter((x) => x);
  split.splice(0, 1);

  const [pluginID] = split.splice(0, 1); // pop the plugin id
  const plugin = plugins.get(pluginID);
  if (!plugin) {
    return res.sendStatus(404);
  }

  const imgPath = split.join(path.sep);
  const fullPath = path.join(plugin.folder, imgPath);

  res.sendFile(fullPath);
}

/**
 * Exports the plugin routes.
 */
export default (app: Application) => {
  app.get("/module", warm(ListModules));
  app.get("/plugin-uninstall/:id", warm(UninstallPlugin));
  app.get("/plugin", warm(ListPlugins));
  app.get("/plugin/:id", warm(GetPluginInfo));
  app.post("/plugin/:pluginID/:moduleID/start", warm(StartPluginModule));
  app.post("/plugin/:pluginID/:moduleID/stop", warm(StopPluginModule));
  app.post("/install-plugin", warm(InstallPlugin));
  app.put("/plugin/:id", warm(EditPluginSettings));
  app.post("/plugin/:id/enable", warm(EnablePlugin));
  app.post("/plugin/:id/disable", warm(DisablePlugin));
  app.post("/plugin/:id/start", warm(StartPlugin));
  app.post("/plugin/:id/stop", warm(StopPlugin));
};
