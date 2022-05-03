import { IAction, IActionListQuery } from "@tago-io/tcore-sdk/types";
import axios from "axios";

/**
 * Retrieves a list of actions.
 */
async function getActionList(page: number, amount: number, filter: any): Promise<IAction[]> {
  const params: IActionListQuery = {
    page: page + 1,
    amount,
    filter: {
      active: filter.active ?? undefined,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: ["name", "active", "action", "last_triggered", "created_at"],
  };

  const response = await axios.get("/action", { params });
  const { data } = response;

  return data.result || [];
}

export default getActionList;
