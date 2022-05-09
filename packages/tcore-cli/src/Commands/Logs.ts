import fs from "fs";
import path from "path";
import * as API from "@tago-io/tcore-api";
import chalk from "chalk";
import { Tail } from "tail";
import { getSystemName } from "@tago-io/tcore-shared";
import { pm2Connect, pm2Disconnect, pm2GetApp } from "../Helpers/PM2";
import { log, oraLog } from "../Helpers/Log";

/**
 */
export async function showLogs() {
  try {
    await pm2Connect();

    const app = await pm2GetApp();
    if (!app) {
      log(`${getSystemName()} Server is ${chalk.yellow("not running in the background")}`);
      return;
    }

    const settingsPath = await API.getMainSettingsFolder();
    const pm2LogPath = path.join(settingsPath, "tcore.log");

    const data = fs.readFileSync(pm2LogPath, { encoding: "utf-8" });
    console.log(data);

    const tail = new Tail(pm2LogPath);

    tail.on("line", (data: any) => {
      console.log(data);
    });

    tail.on("error", () => {
      oraLog(`Something went wrong while fetching the logs`).fail();
      process.exit(1);
    });
  } finally {
    await pm2Disconnect();
  }
}
