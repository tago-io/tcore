import chalk from "chalk";
import * as API from "@tago-io/tcore-api";
import { log } from "../Helpers/Log";
import { pm2Connect, pm2Disconnect, pm2GetApp } from "../Helpers/PM2";

/**
 * Prints the status of the server (started/stopped).
 */
export async function status() {
  try {
    await pm2Connect();

    const app = await pm2GetApp();
    if (app?.pm2_env?.status === "online") {
      log(`${API.getSystemName()} Server is ${chalk.green("started")} with PID`, app.pid);
    } else {
      log(`${API.getSystemName()} Server is ${chalk.redBright("stopped")}`);
    }
  } catch (ex: any) {
    log(chalk.redBright(`Unexpected error: ${ex?.message || ex}`));
  } finally {
    await pm2Disconnect();
  }
}
