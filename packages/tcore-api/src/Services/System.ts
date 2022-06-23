// @ts-ignore
import pkg from "../../../../package.json";
import { getAccountAmount } from "./Account/Account";
import { getMainDatabaseModule } from "./Plugins";
import { getMainSettings } from "./Settings";

/**
 * Retrieves the version of the tcore application.
 */
export function getVersion() {
  return pkg.version;
}

/**
 */
export async function getStatus() {
  const settings = await getMainSettings();
  const dbModule = await getMainDatabaseModule();
  const output: any = {
    version: getVersion(),
    database: { configured: true },
    master_password: !!settings.master_password,
    account: (await getAccountAmount().catch(() => 0)) > 0,
  };

  if (!settings.database_plugin || !dbModule) {
    output.database.configured = false;
  } else if (dbModule.error || dbModule.plugin.error) {
    output.database.error = true;
  }

  return output;
}
