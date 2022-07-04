import { ESocketRoom } from "@tago-io/tcore-sdk/types";
import chalk from "chalk";
import ora from "ora";
import { getSystemName } from "@tago-io/tcore-shared";
import boxen from "boxen";
import { getMainSettings } from "../Services/Settings";
import { plugins } from "../Plugins/Host";
import { io } from "../Socket/SocketServer";
import { getLocalIPs } from "../Services/Hardware";
// @ts-ignore
import pkg from "../../../../package.json";

/**
 * Contains a history of all logs in the application and in the plugins.
 */
export const logBuffer = new Map<string, any>();

/**
 * Adds the message to the log buffer.
 */
function addToBuffer(channel: string, type: string, ...args: any[]) {
  if (!logBuffer.has(channel)) {
    logBuffer.set(channel, []);
  }

  const data: any = {
    error: type === "error",
    message: args.join(" "),
    timestamp: new Date(),
    type,
  };

  // push to log buffer
  logBuffer.get(channel).push(data);

  // also emit to the frontend
  io?.to(ESocketRoom.log).emit(`log::${channel}`, data);
}

/**
 */
export function log(channel: string, ...args: any[]) {
  addToBuffer(channel, "log", args);
  internalLog(channel, ...args);
}

/**
 */
export function logError(channel: string, ...args: any[]) {
  addToBuffer(channel, "error", args);
  const redArgs = args.map((x) => chalk.red(x.toString()));
  internalLog(channel, ...redArgs);
}

/**
 */
export function oraLog(channel: string, ...args: any[]) {
  ora(...args).succeed();
  addToBuffer(channel, "log", ...args);
}

/**
 */
export function oraLogError(channel: string, ...args: any[]) {
  ora(...args).fail();
  addToBuffer(channel, "error", ...args);
}

/**
 * Internally logs a string.
 */
export function internalLog(channel: string, ...args: any[]) {
  if (typeof args[args.length - 1] === "string") {
    // trim the last line to prevent extras \n
    args[args.length - 1] = args[args.length - 1].trim();
  }

  if (channel === "api") {
    const colored = chalk.magenta(`[${getSystemName()}]`);
    console.log(colored, ...args);
  } else {
    const plugin = plugins.get(String(channel).split(":")?.[1])?.tcoreName;
    const colored = chalk.yellow(`[Plugin ${plugin}]`);
    console.log(colored, ...args);
  }
}

/**
 * Logs the "start box" with the localhost and internal ips.
 */
export async function logSystemStart(port?: number | string) {
  const systemName = getSystemName();
  const systemVers = pkg?.version;

  const settings = await getMainSettings();
  const realPort = port || settings.port;

  const lines = [`${systemName} v${systemVers} is ready!`, "", `- Local:             http://localhost:${realPort}`];

  const netAddresses = getLocalIPs();
  if (netAddresses[0]) {
    lines.push(`- On your network:   http://${netAddresses[0]}:${realPort}`);
  }

  console.log("");
  console.log(chalk.green(boxen(lines.join("\n"), { padding: 1 })));
  console.log("");
}
