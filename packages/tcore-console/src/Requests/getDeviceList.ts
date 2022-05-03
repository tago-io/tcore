import { Account } from "@tago-io/sdk";
import { DeviceQuery } from "@tago-io/sdk/out/modules/Account/devices.types";
import { IDevice } from "@tago-io/tcore-sdk/types";

/**
 * Retrieves a list of devices.
 */
async function getDeviceList(page: number, amount: number, filter: any) {
  const account = new Account({ token: "TMP_TOKEN" });
  const query = {
    page,
    amount,
    filter: {
      active: filter.active,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: ["name", "last_input", "last_output", "active", "created_at", "type", "data_retention"],
  };

  const devices = await account.devices.list(query as DeviceQuery);
  return devices as any as IDevice[];
}

export default getDeviceList;
