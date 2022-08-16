#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import chalk from "chalk";
import ora from "ora";
import tar from "tar";
import glob from "glob";
import semver from "semver";
import { program } from "commander";
import getImageData from "image-size";
import { z } from "zod";
import { zPluginPermission, zPluginType } from "../Types";

const cwd = process.cwd();
const pkg = require(path.join(cwd, "package.json"));
const pkgName = pkg.name.replace("@", "").replace(/\//g, "-");

/**
 * Glob of patterns to ignore. Acquired from the .tcoreignore file.
 */
let tcoreIgnore: string[] = [];

/**
 * The name of the output file.
 */
let outputFile = `${pkgName}-${pkg.version}.tcore`;

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
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 */
function getSha256OutputFile() {
  return new Promise((resolve) => {
    const stream = crypto.createHash("sha1").setEncoding("hex");
    fs.createReadStream(path.join(cwd, outputFile))
      .pipe(stream)
      .on("finish", () => resolve(stream.read()));
  });
}

/**
 */
async function printDetails(spinner: ora.Ora, amountOfFiles: number) {
  const filePath = path.join(cwd, outputFile);
  const stat = await fs.promises.stat(filePath).catch(() => null);
  const size = stat?.size || 0;

  console.log(`${chalk.magentaBright("[TCore SDK]")} ${chalk.magenta(`====== Details ======`)}`);

  const shasum = await getSha256OutputFile();

  spinner.succeed(`name:     ${pkg.name}`);
  spinner.succeed(`version:  ${pkg.version}`);
  spinner.succeed(`filename: ${outputFile}`);
  spinner.succeed(`size:     ${formatBytes(size)}`);
  spinner.succeed(`shasum:   ${shasum}`);
  spinner.succeed(`files:    ${amountOfFiles}`);
}

/**
 */
async function pack(spinner: ora.Ora): Promise<number> {
  const files: string[] = [];

  if (pkg.files) {
    for (const item of pkg.files) {
      const ignore = [outputFile, ".DS_Store", ...tcoreIgnore];
      const globFiles = glob.sync(item, { cwd, ignore, dot: true });
      files.push(...globFiles);
    }
  } else {
    const ignore = [outputFile, ".gitignore", "node_modules", "node_modules/**", ".git", ".git/**/*", ...tcoreIgnore];
    const globFiles = glob.sync("**/*", { cwd, ignore, dot: true });
    files.push(...globFiles);
  }

  if (!files.includes("package.json")) {
    // package.json is necessary, cannot remove it
    files.push("package.json");
  }

  const fd = pkg.tcore?.full_description || "";
  if (fd) {
    // full description is necessary, cannot remove it
    files.push(fd);
  }

  let amount = 0;

  for (const file of files) {
    const stat = fs.statSync(path.join(cwd, file));
    const size = stat.size;
    if (!stat.isDirectory()) {
      spinner.succeed(`Added ${chalk.cyan(file)} (${formatBytes(size)})`);
      amount++;
    }
  }

  spinner.start("Generating .tcore file");

  return await new Promise<number>((resolve, reject) => {
    const opts = {
      cwd,
      gzip: true,
      file: path.join(cwd, outputFile),
    };

    tar.c(opts, files, (err) => {
      if (err) {
        reject(err);
      } else {
        spinner.succeed("Generated .tcore file");
        resolve(amount);
      }
    });
  });
}

/**
 */
function validate(spinner: ora.Ora): boolean {
  let error = false;

  const setMessage = (m: string) => {
    spinner.fail(chalk.redBright(m));
    error = true;
  };

  // ------------------------------
  // engine, not required but must be a valid semver if present
  const engine = pkg.engines?.tcore;
  if (engine && !semver.validRange(engine)) {
    setMessage(`'package.engines.tcore' has an invalid TCore range (${engine})`);
  }

  // ------------------------------
  // types must exist and have valid values
  const types = pkg.tcore?.types || [];
  if (types.length === 0) {
    setMessage("'package.tcore.types' should contain at least one module type");
  }
  if (!z.array(zPluginType).safeParse(types).success) {
    setMessage("'package.tcore.types' contains one or more invalid values");
  }

  // ------------------------------
  // permissions must have valid values if it exists
  const permissions = pkg.tcore?.permissions || [];
  if (!z.array(zPluginPermission).safeParse(permissions).success) {
    setMessage("'package.tcore.permissions' contains one or more invalid values");
  }

  // ------------------------------
  // icon validation, required
  const icon = pkg.tcore?.icon || "";
  const iconPath = path.join(cwd, icon);
  const iconExists = fs.existsSync(iconPath);
  if (icon && iconExists) {
    const data = getImageData(iconPath);
    const ratio = ((data.width || 0) / (data.height || 1)).toFixed(2);
    const valid = data.type === "png" && ratio === "1.35";
    if (!valid) {
      setMessage(
        "'package.tcore.icon' should be a PNG image with aspect ratio of 50:37 (width 1.35x larger then height)"
      );
    }
  } else {
    setMessage("'package.tcore.icon' file not found");
  }

  // ------------------------------
  // full description, not required
  const fd = pkg.tcore?.full_description || "";
  const fdPath = path.join(cwd, fd);
  const fdExists = fs.existsSync(fdPath);
  if (fd && !fdExists) {
    setMessage("'package.tcore.full_description' file not found");
  }

  return error;
}

/**
 */
async function generate(opts: any) {
  tcoreIgnore = await fs.promises
    .readFile(path.join(cwd, ".tcoreignore"), "utf-8")
    .then((r) => r.split("\n").filter((x) => x))
    .catch(() => []);

  const spinner = ora("Validating package.json");
  spinner.prefixText = chalk.magentaBright("[TCore SDK]");

  try {
    const error = validate(spinner);
    if (error && !opts.force) {
      spinner.fail("Process aborted due to errors");
      return;
    }
    if (opts?.output) {
      outputFile = opts.output;
    }

    const amountOfFiles = await pack(spinner);
    await printDetails(spinner, amountOfFiles);
  } catch (ex: any) {
    spinner.fail(`${spinner.text} - ${chalk.redBright(ex?.message || ex)}`);
  }
}

program
  .command("pack")
  .option("-f, --force", "Forces creation even with errors")
  .option("-o, --output <value>", "Set the output name of the file")
  .description("Creates a .tcore file from a package")
  .action(generate);

program.parse();
