import { Account } from "@tago-io/sdk";
import chalk from "chalk";
import { getConfigToken, oraLog } from "../Helpers";

/**
 * Logs which account the user is currently logged in as.
 */
async function whoAmI() {
  const spinner = oraLog("Checking credentials");

  try {
    const token = await getConfigToken();
    if (!token) {
      oraLog("Not logged in").fail();
      return;
    }

    spinner.start();

    const account = new Account({ token, region: "usa-1" });
    const { profile: profileID } = await account.run.info();

    const { info: profile } = await account.profiles.info(profileID);

    spinner.succeed(`You're logged in as ${chalk.cyan.bold(profile.name)}`);
  } catch (ex: any) {
    spinner.fail(ex.message || ex);
  }
}

export { whoAmI };
