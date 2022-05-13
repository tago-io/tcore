import os from "os";
import path from "path";
import fs from "fs";
import axios from "axios";
import tar from "tar";
import { ESocketRoom, IPluginInstallOptions } from "@tago-io/tcore-sdk/types";
import { extractTar, peekTarFile } from "../Helpers/Tar/Tar";
import { getPlatformAndArch } from "../Helpers/Platform";
import { getMainSettings } from "../Services/Settings";
import { logError, log } from "../Helpers/log";
import { io } from "../Socket/SocketServer";
import { generatePluginID } from "./PluginID";
import { plugins, startPlugin } from "./Host";
import { uninstallPlugin } from "./Uninstall";

/**
 * Last progress emitted by the socket. We use this to keep track of it and
 * maybe send the same progress if an error ocurred.
 */
let lastProgress: number | undefined = 0;

/**
 */
function emitInstallLog(data: any) {
  io?.to(ESocketRoom.pluginInstall).emit("plugin::install", {
    error: data?.error,
    message: data?.message,
    progress: data?.progress ?? lastProgress,
  });
}

/**
 * Adds a log into the log buffer of the application and triggers the socket
 * event for all sockets attached with the `pluginInstall` resource.
 */
function addLog(opts: IPluginInstallOptions, error: boolean, message: string, progress?: number) {
  if (opts?.log) {
    if (error) {
      logError("api", message);
    } else {
      log("api", message);
    }
  }

  emitInstallLog({ error, message, progress });

  if (progress) {
    lastProgress = progress;
  }
}

/**
 * Gracefully stops the execution of the current version of the plugin.
 * If the plugin is not currently running then this will do nothing.
 */
async function gracefullyStopCurrentVersion(pluginID: string, opts: IPluginInstallOptions = {}): Promise<void> {
  const plugin = plugins.get(pluginID);
  if (plugin) {
    addLog(opts, false, `Gracefully stopping current version, please wait...`, 98);
    await plugin.stop(false, 10000).catch(() => null);
    plugins.delete(pluginID);
  }
}

/**
 * Extracts the `plugin.tar.gz` file into the plugins folder.
 * First it decompresses the file into a simple .tar file (without the gzip) and then
 * it proceeds to extract the tar into the plugins folder.
 * @param {string} filePath The `plugin.tar.gz` full path location.
 * @param {string} pluginID The plugin id to compose the folder name.
 */
async function extract(filePath: string, pluginID: string, opts: IPluginInstallOptions = {}): Promise<string> {
  const settings = await getMainSettings();
  const destination = path.join(settings.plugin_folder, pluginID);

  await extractTar(filePath, destination, true);

  addLog(opts, false, `Plugin successfully extracted`, 95);

  return destination;
}

/**
 * Tries to parse the package.json of the plugin and throws an error if it couldn't.
 */
async function parsePackageJSON(str: string): Promise<any> {
  try {
    return JSON.parse(str);
  } catch (ex) {
    throw new Error("Invalid JSON data in package.json file");
  }
}

/**
 * This should be called when something went wrong during the installation or execution
 * of a new version of a plugin.
 *
 * This function will delete the current folder of the plugin and replace it with the folder
 * in the backup file.
 */
async function restoreBackup(backupFile: string, pluginID: string, opts: IPluginInstallOptions = {}) {
  if (!backupFile || !pluginID) {
    // backup file not created or plugin id was not acquired yet
    return;
  }

  const settings = await getMainSettings();

  addLog(opts, false, `Starting backup restoration`);

  await uninstallPlugin(pluginID);
  await extractTar(backupFile, settings.plugin_folder);
  await fs.promises.unlink(backupFile);

  addLog(opts, false, `Backup successfully restored!`);

  try {
    addLog(opts, false, `Starting the backup, please wait...`);
    await startPlugin(path.join(settings.plugin_folder, pluginID));
    addLog(opts, false, `Done!`, 100);
  } catch (ex: any) {
    addLog(opts, true, "The backup was restored, but could not run");
  }
}

/**
 * Creates a backup of the plugin and stores it into a temporary folder.
 * If something goes wrong during the extraction or execution of the new version
 * then this backup should be restored.
 */
async function backupPlugin(pluginID: string, opts: IPluginInstallOptions = {}): Promise<string> {
  const settings = await getMainSettings();
  const pluginFolder = path.join(settings.plugin_folder, pluginID);

  const backupFile = path.join(pluginFolder, "..", `${pluginID}-bkp.tar`);

  await tar.create({ cwd: path.join(pluginFolder, ".."), file: backupFile }, [pluginID]);

  addLog(opts, false, `Created backup for current version`, 95);

  return backupFile;
}

/**
 * Validates the package.json of the file without extracting it. This function will
 * throw an error if the plugin has no support for the current operating system.
 */
async function validatePackage(filePath: string): Promise<any> {
  const data: Uint8Array[] = await peekTarFile(filePath, "package.json");

  if (data.length === 0) {
    throw new Error(
      "Could not read package.json file of plugin. Make sure the file exists and the plugin is in the .tar.gz format"
    );
  }

  const str = Buffer.concat(data).toString();
  const pkg = await parsePackageJSON(str);

  const pluginPlatform = pkg?.tcore?.platform || "any";
  const thisPlatform = getPlatformAndArch();
  if (pluginPlatform !== thisPlatform && pluginPlatform !== "any") {
    throw new Error(`The plugin is not compatible with this platform (only ${pluginPlatform})`);
  }

  return pkg;
}

/**
 * Downloads a plugin file and stores it into a temporary folder.
 * @param {string} url HTTP/HTTPS URL.
 */
async function downloadPlugin(url: string, opts: IPluginInstallOptions = {}): Promise<string> {
  addLog(opts, false, `Downloading plugin from URL (this may take a while) ...`, 35);

  const response = await axios({ method: "GET", url, responseType: "stream" });
  const fileSize = Number(response.headers["content-length"] || 0);

  const tempFolder = await fs.promises.mkdtemp(path.join(os.tmpdir(), "tcore-plugin-download"));
  const tempFilePath = path.join(tempFolder, "plugin.tar.gz");
  const fileStream = fs.createWriteStream(tempFilePath);

  let downloadedSize = 0;
  let lastPercentage = 0;

  return new Promise((resolve, reject) => {
    if (fileSize) {
      response.data.on("data", (chunk: Buffer) => {
        downloadedSize += chunk.length;
        const percentage = (downloadedSize / fileSize) * 100;
        const shouldOutput = percentage === 100 || percentage > lastPercentage + 5;
        if (shouldOutput) {
          // only outputs every 5% or at 100% to not overwhelm the socket server
          lastPercentage = percentage;
          addLog(opts, false, `Downloading | Progress: ${percentage.toFixed(2)}%`, 35);
        }
      });
    }

    fileStream.on("finish", () => {
      addLog(opts, false, `Plugin successfully downloaded`, 50);
      fileStream.close();
      resolve(tempFilePath);
    });

    fileStream.on("error", (error) => {
      fileStream.close();
      reject(error);
    });

    response.data.pipe(fileStream);
  });
}

/**
 * Resolves the source into a single file path in the system.
 * If the source is a URL then the file will be downloaded and the resulting file path will be returned.
 * If the source is a local file it will be returned as it is.
 * @param {string} source Local path in the filesystem or a HTTP/HTTPS URL.
 */
async function resolveSource(source: string, opts: IPluginInstallOptions = {}) {
  if (source.startsWith("http")) {
    // online file, we need to download it
    return await downloadPlugin(source, opts);
  } else {
    // local file, just return it because that's where the file is located
    return source;
  }
}

/**
 * Installs a plugin from a source.
 * @param {string} source Local path in the filesystem or a HTTP/HTTPS URL.
 */
async function installPlugin(source: string, opts: IPluginInstallOptions = {}) {
  addLog(opts, false, `Installing plugin`, 0);

  let pluginPath = "";
  let backupFile = "";
  let pluginID = "";

  try {
    const filePath = await resolveSource(source, opts);
    const pluginPkg = await validatePackage(filePath);
    pluginID = generatePluginID(pluginPkg.name);

    const settings = await getMainSettings();
    const pluginFolder = path.join(settings.plugin_folder, pluginID);
    const exists = fs.existsSync(pluginFolder);
    if (exists) {
      // plugin is already installed.
      // we need to gracefully stop the plugin because we will override it with new files
      await gracefullyStopCurrentVersion(pluginID, opts);

      // we also need to make a backup of the current files in case something goes wrong
      // during the execution or installation of the new version
      backupFile = await backupPlugin(pluginID, opts);
    }

    pluginPath = await extract(filePath, pluginID, opts);

    addLog(opts, false, `Plugin successfully installed`, 99);
  } catch (ex: any) {
    const err = ex?.message || ex?.toString?.() || ex;
    addLog(opts, true, `An error ocurred: ${err}`);
    addLog(opts, true, "The plugin was not installed");

    if (opts?.restoreBackup) {
      await restoreBackup(backupFile, pluginID, opts);
    }

    throw err;
  }

  if (opts?.start) {
    try {
      addLog(opts, false, `Starting the plugin, please wait...`, 99);

      await startPlugin(pluginPath);

      addLog(opts, false, `Done!`, 100);
    } catch (ex: any) {
      const err = ex?.message || ex?.toString?.() || ex;
      addLog(opts, true, err);
      addLog(opts, true, "The plugin was installed, but could not run");

      if (opts?.restoreBackup) {
        await restoreBackup(backupFile, pluginID, opts);
      }

      throw err;
    }
  } else {
    addLog(opts, false, `Done!`, 100);
  }
}

export { installPlugin, emitInstallLog };
