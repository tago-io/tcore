import path from "path";
import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { pm2Connect, pm2Disconnect, pm2Restart, pm2GetApp } from "../Helpers/PM2";
import { log } from "../Helpers/Log";

/**
 * Restarts the server if it is started.
 * If the server is not started, this command will no do anything.
 */
export async function restart() {
  try {
    await pm2Connect();

    const app = await pm2GetApp();
    if (app) {
      const settingsPath = await API.getMainSettingsFolder();
      const pm2LogPath = path.join(settingsPath, "tcore.log");
      await fs.promises.unlink(pm2LogPath).catch(() => null);

      await pm2Restart();

      const newApp = await pm2GetApp();
      if (newApp) {
        log(`${API.getSystemName()} Server was ${chalk.green("successfully restarted")} with PID`, newApp.pid);
      } else {
        log(`${API.getSystemName()} Server ${chalk.redBright("could not be started")}.`);
        log(`You can check the logs by running ${chalk.cyan("tcore logs")}`);
      }
    } else {
      log(`${API.getSystemName()} Server is ${chalk.redBright("not started")}`);
      log(`To start ${API.getSystemName()}, run ${chalk.cyan("tcore start")}`);
    }
  } finally {
    await pm2Disconnect();
  }
}
