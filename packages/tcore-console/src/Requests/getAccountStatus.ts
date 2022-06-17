import axios from "axios";
import store from "../System/Store";

/**
 * Finds out if at least one account has been set up.
 */
async function getAccountStatus(): Promise<boolean> {
  const response = await axios.get("/account/status", { headers: { token: store.token } });
  return response.data.result;
}

export default getAccountStatus;
