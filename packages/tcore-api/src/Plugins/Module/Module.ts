/* eslint-disable no-unused-vars */
import { IModuleSetup, TModuleState } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import { io } from "../../Socket/SocketServer";
import { getPluginSettings } from "../../Services/Settings/Settings";
import Plugin from "../Plugin/Plugin";

/**
 * Class that manages a single module of a plugin.
 */
class Module {
  public error: string | null;
  public id: string;
  public message: any = null;
  public name: string;
  public state: TModuleState;

  constructor(public plugin: Plugin, public setup: IModuleSetup) {
    this.name = setup.name;
    this.id = setup.id;
    this.state = "idle";
    this.error = null;
  }

  /**
   * Invokes a function in the module.
   */
  public async invoke(method: string, ...args: any[]) {
    if (this.state !== "started") {
      throw new Error(`Module "${this.name}" is not running`);
    }
    const result = await this.plugin.worker.invoke(this.setup.id, method, ...args);
    return result;
  }

  /**
   * Invokes the "stop" (onDestroy) function of the module.
   */
  public async stop() {
    if (this.plugin.state === "stopped" || this.plugin.state === "disabled") {
      throw new Error("Plugin is stopped");
    }
    try {
      this.error = null;
      this.state = "stopping";
      this.emitSocketUpdate();

      await this.plugin.worker.invoke(this.setup.id, "stop");

      this.error = null;
      this.state = "stopped";
    } catch (ex: any) {
      this.error = ex?.message || String(ex);
      this.state = "stopped";
      throw ex;
    } finally {
      this.emitSocketUpdate();
    }
  }

  /**
   * Invokes the "start" (onLoad) function of the module.
   */
  public async start() {
    if (this.plugin.state === "stopped" || this.plugin.state === "disabled") {
      throw new Error("Plugin is stopped");
    }

    if (this.state === "started") {
      // already started, we must stop the module first
      await this.stop();
    }

    try {
      this.error = null;
      this.state = "starting";
      this.emitSocketUpdate();

      this.plugin.validator.validateModuleSetup(this.setup);

      const values = await this.getConfigValues();

      await this.plugin.worker.invoke(this.setup.id, "start", values);

      this.error = null;
      this.state = "started";
      this.plugin.emitSidebarSocketUpdate();
    } catch (ex: any) {
      this.error = ex?.message || String(ex);
      this.state = "stopped";
      this.plugin.emitSidebarSocketUpdate();
      throw ex;
    } finally {
      this.emitSocketUpdate();
    }
  }

  /**
   */
  public emitSocketUpdate() {
    io?.to(`module#${this.id}`).emit("module::status", {
      id: this.id,
      state: this.state,
      error: this.error || undefined,
      message: this.message || undefined,
    });
  }

  /**
   * Invokes the onCall function of the module.
   */
  public async invokeOnCall(...args: any[]) {
    return await this.invoke("onCall", ...args);
  }

  /**
   * Invokes the onTriggerChange function of the module.
   */
  public async invokeOnTriggerChange(...args: any[]) {
    return await this.invoke("onTriggerChange", ...args);
  }

  /**
   */
  public async getConfigValues() {
    const settings = await getPluginSettings(this.plugin.id);
    const moduleSettings = settings?.modules?.find((x) => x.id === this.id);
    const values = moduleSettings?.values || {};

    const conf = this.setup.configs || [];
    const defs = conf?.filter((x) => "defaultValue" in x && x.defaultValue);
    const flat = flattenConfigFields(defs);
    const defsObject = {};

    for (const item of flat) {
      if ("field" in item && "defaultValue" in item) {
        defsObject[item.field] = item.defaultValue;
      }
    }

    return {
      ...defsObject,
      ...values,
    };
  }
}

export default Module;
