import path from "path";
import fs from "fs";
import JSZip from "jszip";
import axios, { AxiosError } from "axios";
import chalk from "chalk";
import { THardwareTarget } from "../../Types";
import { getConfigToken, oraLog, validateConfigToken } from "../Helpers";
import { DEFAULT_OUT_FOLDERNAME } from "../Constants";
import { IPackArgs, pack } from "./Pack";

/**
 * Arguments from the CLI.
 */
interface IPublishArgs {
  force: boolean;
  visible: string;
  onlyPublish: boolean;
  out: string;
}

/**
 * Current project folder.
 */
const cwd = process.cwd();

/**
 * Extracts the target from the filename.
 */
function extractTarget(filename: string) {
  const targets: THardwareTarget[] = [
    "linux-x64",
    "linux-arm64",
    "linux-armv7",
    "alpine-x64",
    "alpine-arm64",
    "win-x64",
    "mac-x64",
  ];

  for (const target of targets) {
    if (filename.includes(target)) {
      return filename;
    }
  }

  return "any";
}

/**
 * Gets the upload URL.
 */
async function getUploadURL(args: IPublishArgs) {
  const visible = args?.visible === "true";

  const token = await getConfigToken();
  const headers = { token };
  const query = `
    query {
      pluginUpload(active: ${visible})
    }
  `;

  const { data } = await axios({
    method: "POST",
    url: "https://api.tagocore.com/graphql",
    data: { query },
    headers,
  });

  return data.data.pluginUpload;
}

/**
 * Fetches the upload URL and then uploads the zip file to the plugin store.
 */
async function uploadZip(args: IPublishArgs, buffer: Buffer) {
  const url = await getUploadURL(args);
  await axios({
    url,
    method: "PUT",
    data: buffer,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}

/**
 * Generates a zip file of all .tcore files in the out folder.
 */
async function generateZip(args: IPublishArgs) {
  const outDir = path.resolve(cwd, args.out || DEFAULT_OUT_FOLDERNAME);
  const files = await fs.promises.readdir(outDir);
  const zip = new JSZip();

  for (const file of files) {
    if (!file.endsWith(".tcore")) {
      continue;
    }

    const filepath = path.join(outDir, file);
    const target = extractTarget(file);
    const data = await fs.promises.readFile(filepath);

    zip.file(target, data);
  }

  if (Object.keys(zip.files).length === 0) {
    throw new Error(`No .tcore files found in ${outDir}`);
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return buffer;
}

/**
 * Publishes a plugin to the plugin store.
 */
async function publish(args: IPublishArgs) {
  const spinner = oraLog();

  try {
    spinner.start("Validating authentication");

    await validateConfigToken();

    spinner.succeed();
    spinner.start("Validating publisher");

    spinner.succeed();

    if (args.onlyPublish) {
      spinner.succeed(`Skipping ${chalk.cyanBright("pack")} command`);
    } else {
      await pack({ force: args.force, out: args.out } as IPackArgs);

      const visible = !args.visible || args.visible === "true";
      oraLog(`visible:  ${visible}`).succeed();
    }

    console.log(`${chalk.magentaBright("[TCore SDK]")} ${chalk.magenta(`=====================`)}`);

    spinner.start("Generating zip file");

    const buffer = await generateZip(args);

    spinner.succeed();
    spinner.start("Uploading plugin");

    await uploadZip(args, buffer);

    spinner.succeed("Uploaded plugin - it will be processed shortly");
  } catch (ex: any) {
    spinner.fail(ex.message || ex);
  }
}

export type { IPublishArgs };
export { publish };
