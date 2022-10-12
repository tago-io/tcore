import fs from "fs";
import { Account } from "@tago-io/sdk";
import chalk from "chalk";
import { LoginResponse } from "@tago-io/sdk/out/modules/Account/account.types";
import prompt from "prompt";
import ini from "ini";
import { oraLog } from "../Helpers";
import { CONFIG_FILEPATH } from "../Constants";

/**
 * Arguments from the CLI.
 */
interface ILoginArgs {
  username: string;
  password: string;
}

/**
 * Does the `login` request and returns the initial profile.
 */
async function authenticate(email: string, password: string) {
  const account = await Account.login({ email, password }, "usa-1");
  return account;
}

/**
 * Creates and returns the token.
 */
async function createToken(email: string, password: string, account: LoginResponse) {
  const profile = account.profiles.find((x) => x.account === account.id) || account.profiles[0];
  const tokenData = await Account.tokenCreate(
    {
      email,
      expire_time: "3 months",
      name: "Generated automatically by TCore CLI",
      password,
      profile_id: profile.id,
    } as never,
    "usa-1"
  );
  return tokenData.token;
}

/**
 * Deletes and recreates the config file with the token.
 */
async function createConfigFile(token: string) {
  const data = ini.stringify({ token });
  await fs.promises.unlink(CONFIG_FILEPATH).catch(() => null);
  await fs.promises.writeFile(CONFIG_FILEPATH, data, "utf8");
}

/**
 * Gets the email and password from the arguments or from the stdin, depending
 * if they were passed in the options or not.
 */
function getCredentials(args: ILoginArgs) {
  return new Promise<{ email: string; password: string }>((resolve) => {
    const properties: prompt.Properties = {};

    if (!args.username) {
      properties.email = { description: "Email:" };
    }
    if (!args.password) {
      properties.password = { description: "Password:", hidden: true } as any;
    }

    if (Object.keys(properties).length === 0) {
      return resolve({ email: args.username, password: args.password });
    }

    prompt.start();
    prompt.message = "";
    prompt.delimiter = "";
    prompt.get({ properties }, (err, result) => {
      const email = (result?.email || args.username) as string;
      const password = (result?.password || args.password) as string;
      resolve({ email, password });
    });
  });
}

/**
 * Logs into the TagoIO account and stores the token in the configuration file.
 */
async function login(args: ILoginArgs) {
  const spinner = oraLog("Logging in");

  try {
    const { email, password } = await getCredentials(args);

    spinner.start();

    const account = await authenticate(email, password);
    const token = await createToken(email, password, account);

    await createConfigFile(token);

    spinner.succeed(`Successfully logged in as ${chalk.cyan(account.name)}`);
  } catch (ex: any) {
    spinner.fail(ex.message || ex);
  }
}

export type { ILoginArgs };
export { login };
