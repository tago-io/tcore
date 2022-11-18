import fs from "fs";
import { CONFIG_FILEPATH } from "../Constants";
import { getConfigToken, oraLog } from "../Helpers";

/**
 * Logs out if already logged in.
 */
async function logout() {
  try {
    const token = await getConfigToken();
    if (!token) {
      oraLog(`Already logged out`).succeed();
      return;
    }

    await fs.promises.unlink(CONFIG_FILEPATH).catch(() => null);

    oraLog(`Successfully logged out`).succeed();
  } catch (ex: any) {
    oraLog(ex.message || ex).fail();
  }
}

export { logout };
