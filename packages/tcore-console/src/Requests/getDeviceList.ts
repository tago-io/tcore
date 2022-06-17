import { Account } from "@tago-io/sdk";
import { DeviceQuery } from "@tago-io/sdk/out/modules/Account/devices.types";
import { IDevice } from "@tago-io/tcore-sdk/types";
import store from "../System/Store";

/**
 * Retrieves a list of devices.
 */
async function getDeviceList(page: number, amount: number, filter: any): Promise<IDevice[]> {
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

  const account = new Account({ token: store.token });
  const result = await account.devices.list(query as DeviceQuery);
  return result as unknown as IDevice[];
}

export default getDeviceList;
