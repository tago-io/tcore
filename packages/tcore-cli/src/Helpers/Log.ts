import chalk from "chalk";
import ora from "ora";
import { getSystemName } from "@tago-io/tcore-shared";

export function log(...args: any[]) {
  console.log(chalk.cyan(`[${getSystemName()} CLI]`), ...args);
}

export function oraLog(text: string) {
  const spinner = ora(text);
  spinner.prefixText = chalk.cyan(`[${getSystemName()} CLI]`);
  spinner.start();
  return spinner;
}
