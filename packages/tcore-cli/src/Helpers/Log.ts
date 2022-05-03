import chalk from "chalk";
import ora from "ora";
import * as API from "@tago-io/tcore-api";

export function log(...args: any[]) {
  console.log(chalk.cyan(`[${API.getSystemName()} CLI]`), ...args);
}

export function oraLog(text: string) {
  const spinner = ora(text);
  spinner.prefixText = chalk.cyan(`[${API.getSystemName()} CLI]`);
  spinner.start();
  return spinner;
}
