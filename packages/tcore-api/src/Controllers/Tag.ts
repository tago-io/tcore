import { Application } from "express";
import { z } from "zod";
import { getTagKeys } from "../Services/Tag";
import APIController, { ISetupController, warm } from "./APIController";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Retrieves all the tag keys of a resource type.
 */
class GetTagKeys extends APIController<void, void, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getTagKeys(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/tags/keys/:id", warm(GetTagKeys));
};
