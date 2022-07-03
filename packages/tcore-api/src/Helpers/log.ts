import { ESocketRoom } from "@tago-io/tcore-sdk/types";
import chalk from "chalk";
import ora from "ora";
import { getSystemName } from "@tago-io/tcore-shared";
import { plugins } from "../Plugins/Host";
import { io } from "../Socket/SocketServer";

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

  // push to log buffer, but limit to 100 items in a single log channel
  const array = logBuffer.get(channel);
  logBuffer.get(channel).push(data);
  logBuffer.set(channel, array.slice(Math.max(array.length - 100, 0)));

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
