import {
  IActionList,
  IDatabaseActionListQuery,
} from "@tago-io/tcore-sdk/types";
import replaceFilterWildCards from "../../Helpers/replaceFilterWildcards";
import applyQueryPagination from "../../Helpers/applyQueryPagination";
import applyTagFilter from "../../Helpers/applyTagFilter";
import { mainDB } from "../../Database";

/**
 * Retrieves a list of actions.
 */
async function getActionList(
  query: IDatabaseActionListQuery
): Promise<IActionList> {
  const { page, amount, orderBy, fields, filter } = query;

  const pagination = applyQueryPagination(page, amount);

  const knexQuery = mainDB.read
    .select(fields)
    .from("action")
    .offset(pagination.offset)
    .limit(pagination.limit)
    .orderBy(orderBy[0], orderBy[1]);

  applyTagFilter(knexQuery, filter, "action");

  if (filter.id) {
    knexQuery.whereIn(
      "id",
      (Array.isArray(filter.id) ? filter.id : [filter.id]) as string[]
    );
  }
  if (filter.name) {
    knexQuery.where("name", "like", replaceFilterWildCards(filter.name));
  }
  if (filter.type) {
    knexQuery.where("type", filter.type);
  }
  if ("active" in filter) {
    knexQuery.where("active", filter.active);
  }

  const response = await knexQuery;

  return response;
}

export default getActionList;
