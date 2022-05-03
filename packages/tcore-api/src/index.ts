import { installPlugin } from "./Plugins/Install";
import { uninstallPlugin, uninstallPluginByFolder } from "./Plugins/Uninstall";
import { startServer } from "./server";
import { log, logError } from "./Helpers/log";
import { getPlatformAndArch } from "./Helpers/Platform";
import { downloadFile } from "./Helpers/Download";
import Plugin from "./Plugins/Plugin/Plugin";
export * from "./Helpers/Tar/Tar";
export * from "./Helpers/Zip";
export * from "./Services/Plugins";
export * from "./Services/Settings";
export * from "./Services/System";

export {
  downloadFile,
  getPlatformAndArch,
  installPlugin,
  log,
  logError,
  Plugin,
  startServer,
  uninstallPlugin,
  uninstallPluginByFolder,
};
