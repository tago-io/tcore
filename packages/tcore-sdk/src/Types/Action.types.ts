import { z } from "zod";
import { generateResourceID } from "../Shared/ResourceID";
import { zPluginConfigField, IPluginConfigField } from "./Plugin.types";
import { zQuery, zName, zObjectID, zActiveAutoGen, zTagsAutoGen } from "./Common/Common.types";
import { zTags } from "./Tag.types";
import preprocessBoolean from "./Helpers/preprocessBoolean";
import preprocessObject from "./Helpers/preprocessObject";
import removeNullValues from "./Helpers/removeNullValues";

/**
 * Base configuration of an action.
 */
export const zAction = z.object({
  action: z.any(),
  active: z.boolean(),
  created_at: z.date(),
  description: z.string().nullish(),
  device_info: z
    .object({ id: zObjectID })
    .or(z.object({ tag_key: z.string().nonempty(), tag_value: z.string().nonempty() }))
    .optional()
    .nullish(),
  id: zObjectID,
  last_triggered: z.date().nullish(),
  name: zName,
  tags: zTags,
  trigger: z.any().optional(),
  type: z.string(),
  updated_at: z.date().nullish(),
});

/**
 * Configuration to create a new action.
 */
export const zActionCreate = zAction
  .omit({
    last_triggered: true,
    created_at: true,
    id: true,
    updated_at: true,
  })
  .extend({
    active: zActiveAutoGen,
    tags: zTagsAutoGen,
  })
  .transform((x) =>
    removeNullValues({
      ...x,
      created_at: new Date(),
      id: generateResourceID(),
    })
  );

/**
 * Configuration to edit an existing Action.
 */
export const zActionEdit = zAction
  .omit({
    id: true,
    created_at: true,
  })
  .extend({
    active: zAction.shape.active.nullish(),
    tags: zAction.shape.tags.nullish(),
  })
  .partial();

/**
 * Configuration of the action list.
 */
export const zActionList = z.array(
  zAction.partial().extend({
    id: zObjectID,
    tags: zTags,
  })
);

/**
 * Allowed fields in an action list query.
 */
const zActionListQueryFields = z.enum([
  "id",
  "name",
  "tags",
  "active",
  "trigger",
  "action",
  "last_triggered",
  "created_at",
  "updated_at",
  "type",
  "device_info",
  "*",
]);

/**
 * Configuration to query the action list.
 */
export const zActionListQuery = zQuery.extend({
  filter: z.preprocess(
    preprocessObject,
    z
      .object({
        id: zObjectID.or(z.array(zObjectID)),
        tags: zTags,
        name: z.string(),
        active: z.preprocess(preprocessBoolean, z.boolean()),
        type: z.string(),
      })
      .partial()
      .nullish()
      .transform((x) => x ?? {})
  ),
  fields: z
    .array(zActionListQueryFields)
    .nullish()
    .transform((x) => {
      const values = x || ["id", "name", "tags"];
      if (!values.includes("id")) values.push("id");
      if (!values.includes("tags")) values.push("tags");
      return values;
    }),
  orderBy: z
    .tuple([zActionListQueryFields, z.enum(["asc", "desc"])])
    .nullish()
    .transform((x) => x ?? ["name", "asc"]),
});

/**
 * Action types from plugins.
 */
export const zActionType = z.object({
  configs: z.array(zPluginConfigField),
  description: z.string(),
  id: z.string(),
  name: z.string(),
  showDeviceSelector: z.boolean(),
});

export type IAction = z.infer<typeof zAction>;
export type IActionCreate = z.infer<typeof zActionCreate>;
export type IActionEdit = z.infer<typeof zActionEdit>;
export type IActionType = z.infer<typeof zActionType>;
export type IActionList = z.infer<typeof zActionList>;
export type IActionListQuery = z.input<typeof zActionListQuery>;

export interface IActionOption {
  description?: string;
  icon: string;
  name: string;
  configs?: IPluginConfigField[];
  id: string;
}
