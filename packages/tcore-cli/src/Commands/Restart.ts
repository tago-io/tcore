import path from "path";
import fs from "fs";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { IEnvironmentVariables } from "@tago-io/tcore-sdk/types";
import { getSystemName } from "@tago-io/tcore-shared";
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

      // generate a type to access TCORE_PORT without `any`
      type Pm2TCoreEnvironment = typeof app.pm2_env & IEnvironmentVariables;

      // store the env in a variable to make it easier to access
      const env = app.pm2_env as Pm2TCoreEnvironment;

      await pm2Restart();

      const newApp = await pm2GetApp();
      if (newApp) {
        log(`${getSystemName()} Server was ${chalk.green("successfully restarted")} with PID`, newApp.pid);
        API.logSystemStart(env?.TCORE_PORT);
      } else {
        log(`${getSystemName()} Server ${chalk.redBright("could not be started")}.`);
        log(`You can check the logs by running ${chalk.cyan("tcore logs")}`);
      }
    } else {
      log(`${getSystemName()} Server is ${chalk.redBright("not started")}`);
      log(`To start ${getSystemName()}, run ${chalk.cyan("tcore start")}`);
    }
  } finally {
    await pm2Disconnect();
  }
}
