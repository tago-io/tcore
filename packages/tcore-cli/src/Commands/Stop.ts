import chalk from "chalk";
import { getSystemName } from "@tago-io/tcore-shared";
import { pm2Connect, pm2Delete, pm2Disconnect, pm2GetApp } from "../Helpers/PM2";
import { log } from "../Helpers/Log";

/**
 * Stops the server if it is running through the PM2 daemon, and then logs the
 * status of the server.
 *
 * If the server is running in foreground this command will do nothing.
 * If the server is already stopped, this command will do nothing.
 */
export async function stop() {
  try {
    await pm2Connect();

    const app = await pm2GetApp();
    if (app) {
      log(`${getSystemName()} Server is started, stopping it...`);
    }

    await pm2Delete();

    log(chalk.green("Successfully stopped"));
  } catch (ex) {
    log(`${getSystemName()} Server is`, chalk.yellow("already stopped"));
  } finally {
    await pm2Disconnect();
  }
}
