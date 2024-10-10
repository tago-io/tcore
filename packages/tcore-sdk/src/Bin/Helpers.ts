import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import chalk from "chalk";
import ora from "ora";
import { Account } from "@tago-io/sdk";
import ini from "ini";
import { CONFIG_FILEPATH } from "./Constants.ts";

/**
 * Creates an ora spinner with the sdk prefix.
 */
function oraLog(...args: any[]) {
  const spinner = ora(...args);
  spinner.prefixText = chalk.magentaBright("[TCore SDK]");
  return spinner;
}

/**
 * Formats the bytes into a more readable format.
 */
function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const dm = 2;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Gets the package json of the CWD project.
 */
function getPackage() {
  try {
    const filePath = path.join(process.cwd(), "package.json");
    const pkg = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(pkg);
    return parsed;
  } catch (ex: any) {
    oraLog(ex.message || ex).fail();
    process.exit(1);
  }
}

/**
 * Gets the sha256 sum of a file.
 */
function getSha256(filepath: string) {
  return new Promise((resolve) => {
    const stream = crypto.createHash("sha1").setEncoding("hex");
    fs.createReadStream(filepath)
      .pipe(stream)
      .on("finish", () => resolve(stream.read()));
  });
}

/**
 * Gets the token from the configuration file.
 */
async function getConfigToken() {
  try {
    if (process.env.TCORE_PLUGIN_TOKEN) {
      return process.env.TCORE_PLUGIN_TOKEN;
    }

    const data = await fs.promises.readFile(CONFIG_FILEPATH, "utf8");
    const parsed = ini.parse(data);
    return parsed.token;
  } catch (ex) {
    return null;
  }
}

/**
 * Validates the config token, if the config token doesn't exist or is invalid
 * then an error will be thrown.
 */
async function validateConfigToken() {
  try {
    const token = await getConfigToken();
    if (!token) {
      throw new Error();
    }

    const account = new Account({ token, region: "usa-1" });
    await account.info();
  } catch (ex) {
    throw new Error("Authorization denied. Are you logged in?");
  }
}

export { validateConfigToken, getConfigToken, getSha256, getPackage, formatBytes, oraLog };
