import chalk from "chalk";
import { getSystemName } from "@tago-io/tcore-shared";
import { log } from "../Helpers/Log.tsx";
import { pm2Connect, pm2Disconnect, pm2GetApp } from "../Helpers/PM2.tsx";

/**
 * Prints the status of the server (started/stopped).
 */
export async function status() {
  try {
    await pm2Connect();

    const app = await pm2GetApp();
    if (app?.pm2_env?.status === "online") {
      log(`${getSystemName()} Server is ${chalk.green("started")} with PID`, app.pid);
    } else {
      log(`${getSystemName()} Server is ${chalk.redBright("stopped")}`);
    }
  } catch (ex: any) {
    log(chalk.redBright(`Unexpected error: ${ex?.message || ex}`));
  } finally {
    await pm2Disconnect();
  }
}
