import fs from "node:fs";
import path from "node:path";
import * as API from "@tago-io/tcore-api";
import { Tail } from "tail";
import { pm2Connect, pm2Disconnect } from "../Helpers/PM2.tsx";
import { oraLog } from "../Helpers/Log.tsx";

/**
 */
export async function showLogs() {
  try {
    await pm2Connect();

    const settingsPath = await API.getMainSettingsFolder();
    const pm2LogPath = path.join(settingsPath, "tcore.log");

    if (!fs.existsSync(pm2LogPath)) {
      // file doesn't exist, don't log
      return;
    }

    const data = fs.readFileSync(pm2LogPath, { encoding: "utf-8" });
    console.log(data);

    const tail = new Tail(pm2LogPath);

    tail.on("line", (data: any) => {
      console.log(data);
    });

    tail.on("error", () => {
      oraLog("Something went wrong while fetching the logs").fail();
      process.exit(1);
    });
  } finally {
    await pm2Disconnect();
  }
}
