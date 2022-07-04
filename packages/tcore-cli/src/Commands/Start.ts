import path from "path";
import fs from "fs";
import { StartOptions } from "pm2";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { getSystemName } from "@tago-io/tcore-shared";
import { pm2Connect, pm2Delete, pm2Disconnect, pm2GetApp, pm2Start, PM2_APP_NAME } from "../Helpers/PM2";
import { log } from "../Helpers/Log";

/**
 * Options of CLI.
 */
interface IStartOptions {
  daemon: boolean;
  databasePlugin: string;
  force: boolean;
  port: string;
  pluginsFolder: string;
  settingsFolder: string;
}

function getEnv(opts: IStartOptions) {
  const env: any = {};
  if (opts.port) env.TCORE_PORT = opts.port;
  if (opts.daemon) env.TCORE_DAEMON = String(opts.daemon);
  if (opts.pluginsFolder) env.TCORE_PLUGIN_FOLDER = opts.pluginsFolder;
  if (opts.settingsFolder) env.TCORE_SETTINGS_FOLDER = opts.settingsFolder;
  if (opts.databasePlugin) env.TCORE_DATABASE_PLUGIN = opts.databasePlugin;
  return env;
}

/**
 * Starts the server.
 *
 * If `opts.daemon` is set to `true`, then the server will be started
 * in the pm2 daemon, otherwise it will be started in the foreground.
 */
export async function start(opts: IStartOptions) {
  if (!opts.daemon) {
    // no daemon, meaning we need to run in foreground
    const env = getEnv(opts);
    for (const key in env) {
      process.env[key] = env[key];
    }
    await API.startServer();
  } else {
    // run with daemon
    await startWithDaemon(opts);
  }
}

/**
 * Start the server with a daemon (background process).
 */
async function startWithDaemon(opts: IStartOptions) {
  try {
    const systemName = getSystemName();
    const exeName = path.basename(process.execPath);
    const env = getEnv(opts);

    await pm2Connect();

    const app = await pm2GetApp();
    if (app?.pm2_env?.status === "online") {
      log(`${systemName} Server is ${chalk.yellow("already started")} with PID`, app.pid);

      if (!opts.force) {
        // the app is already online
        log(`To restart ${systemName}, run ${chalk.cyan(`${exeName} restart`)}`);
        return;
      } else {
        log(`Flag ${chalk.yellow("--force")} detected, restarting down ${systemName} Server`);
        await pm2Delete();
      }
    } else {
      log(`${systemName} Server is stopped, starting it...`);
      await pm2Delete().catch(() => null);
    }

    const settingsPath = await API.getMainSettingsFolder();
    const pm2LogPath = path.join(settingsPath, "tcore.log");

    await fs.promises.unlink(pm2LogPath).catch(() => null);

    const startOptions: StartOptions = {
      script: path.join(__dirname, "../Scripts/StartPM2Dev.js"),
      name: PM2_APP_NAME,
      output: pm2LogPath,
      error: pm2LogPath,
      env,
    };

    await pm2Start(startOptions);

    const newApp = await pm2GetApp();
    if (newApp?.pm2_env?.status === "online") {
      // successfully started new process
      log(`${systemName} Server successfully ${chalk.green("started")} with PID`, newApp.pid);
      API.logSystemStart(env.TCORE_PORT);
    } else {
      // for some reason pm2 could not start the script
      log(`${systemName} Server ${chalk.redBright("could not be started")}.`);
      log(`You can check the logs by running ${chalk.cyan(`${exeName} logs`)}`);
    }
  } catch (ex: any) {
    log(chalk.redBright(`Unexpected error: ${ex?.message || ex}`));
  } finally {
    await pm2Disconnect();
  }
}
