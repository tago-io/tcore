import chalk from "chalk";
import ora from "ora";

export function log(...args: any[]) {
  console.log(chalk.cyan(`[TagoCore CLI]`), ...args);
}

export function oraLog(text: string) {
  const spinner = ora(text);
  spinner.prefixText = chalk.cyan(`[TagoCore CLI]`);
  spinner.start();
  return spinner;
}
