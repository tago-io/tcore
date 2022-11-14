import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import tar from "tar";
import glob from "glob";
import semver from "semver";
import getImageData from "image-size";
import { z } from "zod";
import { THardwareTarget, zHardwareTarget, zPluginPermission, zPluginType } from "../../Types";
import { formatBytes, getPackage, getSha256, oraLog } from "../Helpers";
import { DEFAULT_OUT_FOLDERNAME, TCOREIGNORE_FILENAME } from "../Constants";

/**
 * Arguments from the CLI.
 */
interface IPackArgs {
  filename: string;
  force?: boolean;
  out: string;
  target: THardwareTarget[];
}

/**
 * Current project folder.
 */
const cwd = process.cwd();

/**
 * Current project package.
 */
const pkg = getPackage();

/**
 * Appends the target before the .tcore extension.
 */
function renameTarget(filename: string, target: THardwareTarget) {
  const split = filename.split(".");
  if (split[split.length - 1] === "tcore") {
    split.splice(split.length - 1, 0, target);
  } else {
    split.push(target);
  }
  return split.join(".");
}

/**
 * Trims the extension if it's a .tcore file.
 */
function trimExtension(filename: string) {
  const split = filename.split(".");
  if (split[split.length - 1] === "tcore") {
    split.pop();
  }
  return split.join(".");
}

/**
 * Retrieves a string list of all files that need to be packed in a .tcore archive.
 * This function will take into account the .tcoreignore file and the `files` property
 * of the package.json.
 */
async function getFilesToPack() {
  const files: string[] = [];
  const tcoreIgnore = await fs
    .readFile(path.join(cwd, TCOREIGNORE_FILENAME), "utf-8")
    .then((r) => r.split("\n").filter((x) => x))
    .catch(() => []);

  if (pkg.files) {
    for (const item of pkg.files) {
      const ignore = [".DS_Store", ...tcoreIgnore];
      const globFiles = glob.sync(item, { cwd, ignore, dot: true });
      files.push(...globFiles);
    }
  } else {
    const ignore = [
      TCOREIGNORE_FILENAME,
      `${DEFAULT_OUT_FOLDERNAME}/**`,
      "*.tcore",
      ".gitignore",
      "node_modules",
      "node_modules/**",
      ".git",
      ".git/**/*",
      ...tcoreIgnore,
    ];
    const globFiles = glob.sync("**/*", { cwd, ignore, dot: true });
    files.push(...globFiles);
  }

  if (!files.includes("package.json")) {
    // package.json is necessary, cannot remove it
    files.push("package.json");
  }

  const fullDescription = pkg.tcore?.full_description || "";
  if (fullDescription) {
    files.push(fullDescription);
  }

  return files;
}

/**
 * Generates the original tcore file.
 */
async function generateTCoreFile(args: IPackArgs) {
  // recreate the out path
  const outDir = path.resolve(cwd, args.out);
  await fs.mkdir(outDir, { recursive: true }).catch(() => null);

  const files = await getFilesToPack();

  for (const file of files) {
    const stat = await fs.stat(path.join(cwd, file));
    const size = stat.size;
    if (!stat.isDirectory()) {
      oraLog(`Added ${chalk.cyan(file)} (${formatBytes(size)})`).succeed();
    }
  }

  const spinner = oraLog("Generating .tcore file").start();

  const compressedFile = await compressProject(args, files, spinner);

  return compressedFile;
}

async function compressProject(args: IPackArgs, files: string[], spinner) {
  return await new Promise<void>((resolve, reject) => {
    const tarOpts = {
      cwd,
      gzip: true,
      file: path.resolve(cwd, args.out, args.filename),
    };

    tar.c(tarOpts, files, (err) => {
      if (err) {
        spinner.fail();
        reject(err);
      } else {
        spinner.succeed();
        resolve();
      }
    });
  });
}

/**
 * Copies the original file to all other specified targets.
 */
async function copyTargets(args: IPackArgs) {
  const spinner = oraLog("Generating target files").start();

  const origin = path.resolve(cwd, args.out, args.filename);
  for (const target of args.target) {
    const dest = renameTarget(origin, target);
    await fs.copyFile(origin, dest);
  }

  spinner.succeed();
}

/**
 * Prints the details of the generated .tcore files.
 */
async function printDetails(args: IPackArgs) {
  const filePath = path.resolve(cwd, args.out, args.filename);
  const stat = await fs.stat(filePath).catch(() => null);
  const size = stat?.size || 0;

  console.log(`${chalk.magentaBright("[TCore SDK]")} ${chalk.magenta(`====== Details ======`)}`);

  const shasum = await getSha256(filePath);

  oraLog(`name:     ${pkg.name}`).succeed();
  oraLog(`version:  ${pkg.version}`).succeed();
  oraLog(`filename: ${trimExtension(args.filename)}`).succeed();
  oraLog(`size:     ${formatBytes(size)}`).succeed();
  oraLog(`target:   ${args.target.length === 0 ? "Cross platform" : args.target.join(", ")}`).succeed();
  oraLog(`shasum:   ${shasum}`).succeed();
}

/**
 * Validates the args and package of the project.
 */
async function validate(args: IPackArgs) {
  let error = false;

  const addMessage = (m: string) => {
    oraLog(chalk.redBright(m)).fail();
    error = true;
  };

  // ------------------------------
  // validates the target array
  for (const target of args.target) {
    const valid = zHardwareTarget.safeParse(target).success;
    if (!valid) {
      addMessage(`target '${target}' is invalid`);
    }
  }

  // ------------------------------
  // engine, not required but must be a valid semver if present
  const engine = pkg.engines?.tcore;
  if (engine && !semver.validRange(engine)) {
    addMessage(`'package.engines.tcore' has an invalid TCore range (${engine})`);
  }

  // ------------------------------
  // types must exist and have valid values
  const types = pkg.tcore?.types || [];
  if (types.length === 0) {
    addMessage("'package.tcore.types' should contain at least one module type");
  }
  if (!z.array(zPluginType).safeParse(types).success) {
    addMessage("'package.tcore.types' contains one or more invalid values");
  }

  // ------------------------------
  // permissions must have valid values if it exists
  const permissions = pkg.tcore?.permissions || [];
  if (!z.array(zPluginPermission).safeParse(permissions).success) {
    addMessage("'package.tcore.permissions' contains one or more invalid values");
  }

  // ------------------------------
  // icon validation, required
  const icon = pkg.tcore?.icon || "";
  const iconPath = path.join(cwd, icon);
  const iconExists = await fs.stat(iconPath).catch(() => null);
  if (icon && iconExists) {
    const data = getImageData(iconPath);
    const ratio = ((data.width || 0) / (data.height || 1)).toFixed(2);
    const valid = data.type === "png" && ratio === "1.35";
    if (!valid) {
      addMessage(
        "'package.tcore.icon' should be a PNG image with aspect ratio of 50:37 (width 1.35x larger then height)"
      );
    }
  } else {
    addMessage("'package.tcore.icon' file not found");
  }

  // ------------------------------
  // full description, not required
  const fd = pkg.tcore?.full_description || "";
  const fdPath = path.join(cwd, fd);
  const fdExists = await fs.stat(fdPath).catch(() => null);
  if (fd && !fdExists) {
    addMessage("'package.tcore.full_description' file not found");
  }

  return error;
}

/**
 * Sets the default values for the args.
 */
async function setDefaultOptsValues(args: IPackArgs) {
  const pkgName = pkg.name.replace("@", "").replace(/\//g, "-");

  args.target = args.target || [];
  args.filename = args.filename || `${pkgName}-${pkg.version}.tcore`;
  args.out = args.out || DEFAULT_OUT_FOLDERNAME;

  if (!args.filename.endsWith(".tcore")) {
    args.filename += ".tcore";
  }
}

/**
 * Generates one or more .tcore files of the project.
 */
async function pack(args: IPackArgs) {
  try {
    await setDefaultOptsValues(args);

    const err = await validate(args);

    if (err && !args.force) {
      oraLog("Process aborted due to errors").fail();
      return;
    }

    await generateTCoreFile(args);

    if (args.target.length > 0) {
      await copyTargets(args);
    }

    await printDetails(args);

    if (args.target.length > 0) {
      const filePath = path.resolve(cwd, args.out, args.filename);
      await fs.unlink(filePath).catch(() => null);
    }
  } catch (ex: any) {
    oraLog(ex.message || ex).fail();
  }
}

export type { IPackArgs };
export { pack, getFilesToPack, compressProject, generateTCoreFile };
