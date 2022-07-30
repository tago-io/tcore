import { Command } from "commander";
import { getSystemName } from "@tago-io/tcore-shared";
import { runVersionMigration } from "@tago-io/tcore-api";
// @ts-ignore
import pkg from "../package.json";
import { showLogs } from "./Commands/Logs";
import { start } from "./Commands/Start";
import { status } from "./Commands/Status";
import { stop } from "./Commands/Stop";
import { restart } from "./Commands/Restart";
import { addPluginCommands } from "./PluginCLI";
import { setPluginSetting } from "./Commands/SetPluginSetting";

/**
 * Creates and returns the base program.
 */
function getBaseProgram() {
  const program = new Command();

  const systemName = getSystemName();

  program.name("tcore").description(`${systemName} CLI v${pkg.version}`).version(pkg.version, "-v, --version");

  program
    .command("start")
    .description(`Start ${systemName} Server`)
    .option("-f, --force", `Restarts ${systemName} if already started`)
    .option("--port <value>", `Set the port for the ${systemName} server`)
    .option("--database-plugin <id>", "Set the database plugin")
    .option("--plugins-folder <path>", "Set the folder to store Plugins")
    .option("--settings-folder <path>", "Set the folder to store Settings")
    .option("--no-daemon", `Run ${systemName} in the foreground without a daemon`)
    .action(start);

  program.command("restart").description(`Restart ${systemName} Server`).action(restart);

  program.command("stop").description(`Stop the ${systemName} Server`).action(stop);

  program.command("status").description(`Get the ${systemName} Server's status`).action(status);

  program.command("logs").description(`Shows the ${systemName} Server logs in real time`).action(showLogs);

  program
    .command("set-plugin-setting")
    .description(`Set a setting for a specific plugin`)
    .argument("<id>", "Plugin slug or ID")
    .argument("<module>", "Plugin module")
    .argument("<key>", "Setting key")
    .argument("[value]", "Value for the setting key")
    .action(setPluginSetting);

  return program;
}

/**
 * Starts the cli, parses and executes the commands from argv.
 */
async function startCLI() {
  await runVersionMigration().catch(() => null);

  const program = getBaseProgram();

  await addPluginCommands(program);

  if (process.env.TCORE_DAEMON) {
    // Workaround:
    // sometimes pm2 replaces the first argument with the bin file path of the cli.
    // This happens at random and I couldn't figure out why, so in daemon mode we
    // manually override the argv to start tcore.
    // (only command that can run in daemon is start)
    const argv = [process.argv[0], process.argv[1], "start", "--no-daemon"];
    program.parse(argv);
  } else {
    program.parse(process.argv);
  }
}

startCLI();
