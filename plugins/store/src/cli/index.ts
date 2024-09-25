import { installPlugins } from "./Commands/PluginInstall";
import { listPlugins } from "./Commands/PluginList";
import { searchPlugins } from "./Commands/PluginSearch";
import { uninstallPlugins } from "./Commands/PluginUninstall";
import { updatePlugins } from "./Commands/PluginUpdate";
import { listPluginsVersions } from "./Commands/PluginVersions";
import { enablePlugins, disablePlugins } from "./Commands/ToggleDisabled";

export {
  installPlugins,
  listPlugins,
  listPluginsVersions,
  searchPlugins,
  enablePlugins,
  disablePlugins,
  uninstallPlugins,
  updatePlugins,
};
