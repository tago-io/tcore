import fs from "fs";
import { Account } from "@tago-io/sdk";
import chalk from "chalk";
import { LoginResponse } from "@tago-io/sdk/out/modules/Account/account.types";
import ini from "ini";
import { z } from "zod";
import prompts from "prompts";
import { oraLog } from "../Helpers";
import { CONFIG_FILEPATH } from "../Constants";
import { OTPError, parseOTPError } from "../../Helper/OTP/parseOTPError";

/**
 * Arguments from the CLI.
 */
interface ILoginArgs {
  email: string;
  password: string;
  pin_code?: string;
  otp_type?: string;
}

/**
 * Does the `login` request and returns the initial profile.
 */
async function accountLogin(credentials: ILoginArgs) {
  const account = await Account.login({ ...credentials } as never, "usa-1");
  return account;
}

/**
 * Creates and returns the token.
 */
async function createToken(credentials: ILoginArgs, loginResponse: LoginResponse) {
  const profiles = loginResponse.profiles.map(({ id, name }) => ({
    title: name,
    description: `${id}`,
    value: { id, name },
  }));

  const { profile } = await prompts({
    name: "profile",
    message: "Choose you profile",
    type: "autocomplete",
    choices: profiles,
    limit: 10,
  });

  const tokenData = await Account.tokenCreate(
    {
      ...credentials,
      expire_time: "3 months",
      name: "Generated automatically by TCore CLI",
      profile_id: profile.id,
    } as never,
    "usa-1"
  );
  return { token: tokenData.token, profile };
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
async function getCredentials(args: ILoginArgs): Promise<{ email: string; password: string }> {
  const credentials = { email: args.email, password: args.password };

  if (!args.email) {
    const result = await prompts({
      name: "email",
      type: "text",
      message: "Email",
      validate: (email) => {
        try {
          z.string().email().parse(email);
          return true;
        } catch {
          return "Invalid email";
        }
      },
    });

    credentials.email = result.email;
  }

  if (!args.password) {
    const result = await prompts([
      {
        name: "password",
        message: "Password",
        type: "invisible",
      },
    ]);

    credentials.password = result.password;
  }

  return credentials;
}

/**
 * Logs into the TagoIO account and stores the token in the configuration file.
 */
async function login(args: ILoginArgs) {
  console.info("Logging in");
  const { email, password } = await getCredentials(args);
  try {
    const loginResponse = await accountLogin({ email, password });
    const { token, profile } = await createToken({ email, password }, loginResponse);

    await createConfigFile(token);

    console.info(`Successfully logged as ${chalk.cyan.bold(profile.name)}`);
  } catch (ex: any) {
    const otp = parseOTPError(ex);

    if (!otp) {
      console.error(ex.message || ex);
      return;
    }

    let remainOTPRetries = 3;

    while (remainOTPRetries > 0) {
      try {
        await requestOTP(otp, email, password);
        remainOTPRetries = 0;
      } catch (error: any) {
        oraLog(error?.message || error).fail();
        remainOTPRetries -= 1;
      }
    }
  }
}

async function requestOTP(otp: OTPError, email: string, password: string) {
  const initial = otp.otp_enabled.findIndex((value) => value === otp.otp_autosend) || 0;
  const choices = otp.otp_enabled.map((name) => ({ title: name, value: name }));

  const result = await prompts({
    name: "method",
    message: "Choose authentication method",
    type: "select",
    choices,
    initial,
  });

  const otp_type: typeof otp["otp_autosend"] = result.method;

  let message = "";
  if (otp_type === "authenticator") {
    message = `Your ${chalk.cyan.bold("app")} will display an authentication code.`;
  } else if (otp_type === "sms") {
    message = `We sent you a ${chalk.cyan.bold("SMS")} with the authentication code to your phone ${chalk.cyan.bold(
      otp.phone
    )}. It can take up to 1 minute to arrive.`;
  } else if (otp_type === "email") {
    message = `We sent you an authentication code to your ${chalk.cyan.bold("email")}, it may take a minute to arrive.`;
  }

  console.info(message);

  const { pin_code } = await prompts({
    name: "pin_code",
    type: "text",
    message: "Please enter the pin code",
  });

  await authenticate(email, password, pin_code, otp_type);
}

async function authenticate(email: string, password: string, pin_code: any, otp_type: string) {
  const loginResponse = await accountLogin({ email, password, pin_code, otp_type });
  const { token, profile } = await createToken({ email, password, pin_code, otp_type }, loginResponse);

  await createConfigFile(token);
  console.info(`Successfully logged as ${chalk.cyan.bold(profile.name)}`);
}

export type { ILoginArgs };
export { login };
