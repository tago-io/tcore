import { z } from "zod";
import { v4 as uuid } from "uuid";
import preprocessObject from "../Helpers/preprocessObject";
import preprocessBoolean from "../Helpers/preprocessBoolean";
import removeNullValues from "../Helpers/removeNullValues";
import { generateResourceID } from "../../Shared/ResourceID";
import { zTags } from "../Tag/Tag.types";
import { zToken, TGenericID, zName, zObjectID, zQuery, zActiveAutoGen, zTagsAutoGen } from "../Common/Common.types";
import createQueryOrderBy from "../Helpers/createQueryOrderBy";

/**
 */
export const zDeviceType = z.enum(["mutable", "immutable"]);

/**
 * Configuration of a device parameter.
 */
export const zDeviceParameter = z.object({
  key: z.string(),
  sent: z.preprocess(preprocessBoolean, z.boolean()).nullish(),
  value: z.string(),
  id: zObjectID,
});

/**
 * Configuration of the device param list.
 */
export const zDeviceParameterList = z.array(zDeviceParameter);

/**
 * Configuration to create a new device param.
 */
export const zDeviceParameterCreate = zDeviceParameter.omit({ id: true }).transform((x) => ({
  ...x,
  id: generateResourceID(),
}));

/**
 * Base configuration of a device.
 */
export const zDevice = z.object({
  active: z.boolean(),
  created_at: z.date(),
  id: zObjectID,
  inspected_at: z.date().nullish(),
  last_input: z.date().nullish(),
  last_output: z.date().nullish(),
  name: zName,
  payload_parser: z.string().nullish(),
  tags: zTags,
  encoder_stack: z.array(z.string()).nullish(),
  updated_at: z.date().nullish(),
  data_retention: z.string().nullish(),
  type: zDeviceType.nullish(),
});

/**
 * Configuration to create a new device.
 */
export const zDeviceCreate = zDevice
  .omit({
    created_at: true,
    id: true,
    inspected_at: true,
    last_input: true,
    last_output: true,
    updated_at: true,
  })
  .extend({
    active: zActiveAutoGen,
    tags: zTagsAutoGen,
    data_retention: z
      .string()
      .nullish()
      .transform((x) => x || "forever"),
    type: zDevice.shape.type.transform((x) => x || "immutable"),
  })
  .transform((x) =>
    removeNullValues({
      ...x,
      created_at: new Date(),
      id: generateResourceID(),
    })
  );

/**
 * Configuration to edit an existing device.
 */
export const zDeviceEdit = zDevice
  .omit({
    created_at: true,
    id: true,
  })
  .extend({
    active: zDevice.shape.active.nullish(),
    tags: zDevice.shape.tags.nullish(),
    data_retention: z.string(),
  })
  .partial();

/**
 * Configuration of the device list.
 */
export const zDeviceList = z.array(
  zDevice.partial().extend({
    id: zObjectID,
    tags: zTags,
  })
);

/**
 * Configuration of a device token.
 */
export const zDeviceToken = z.object({
  token: zToken,
  device_id: zObjectID,
  name: zName,
  permission: z.enum(["read", "write", "full"]),
  serie_number: z.string().nullish(),
  last_authorization: z.string().nullish(),
  verification_code: z.string().nullish(),
  expire_time: z.string(),
  created_at: z.date(),
});

/**
 * Configuration of the device token list.
 */
export const zDeviceTokenList = z.array(zDeviceToken);

/**
 * Configuration to create a new device token.
 */
export const zDeviceTokenCreate = zDeviceToken
  .omit({ device_id: true, created_at: true, token: true })
  .extend({
    permission: z
      .enum(["read", "write", "full"])
      .nullish()
      .transform((x) => x || "full"),
    expire_time: z
      .string()
      .nullish()
      .transform((e) => e || "1 month"),
  })
  .transform((x) => ({
    ...x,
    token: uuid(),
    created_at: new Date(),
  }));

/**
 * Response of the create token function.
 */
export const zDeviceTokenCreateResponse = z.object({
  token: z.string(),
  expire_time: z.string(),
  permission: z.enum(["full", "read", "write"]),
});

/**
 */
export interface ICreateDeviceResponse {
  device_id: TGenericID;
  token: TGenericID;
}

/**
 * Allowed fields in a device list query.
 */
const zDeviceListQueryField = z.enum([
  "id",
  "name",
  "active",
  "payload_parser",
  "data_retention",
  "type",
  "last_output",
  "last_input",
  "inspected_at",
  "created_at",
  "updated_at",
  "tags",
  "encoder_stack",
]);

/**
 * Configuration to query the device list.
 */
export const zDeviceListQuery = zQuery.extend({
  filter: z.preprocess(
    preprocessObject,
    z
      .object({
        id: zObjectID.or(z.array(zObjectID)),
        tags: zTags,
        name: z.string(),
        active: z.preprocess(preprocessBoolean, z.boolean()),
      })
      .partial()
      .nullish()
      .transform((x) => x ?? {})
  ),
  fields: z
    .array(zDeviceListQueryField)
    .nullish()
    .transform((x) => {
      const values = x || ["id", "name", "tags"];
      if (!values.includes("id")) values.push("id");
      if (!values.includes("tags")) values.push("tags");
      return values;
    }),
  orderBy: createQueryOrderBy(zDeviceListQueryField),
});

/**
 */
export const zDeviceTokenListQuery = zQuery.extend({
  fields: z
    .array(z.enum(["name", "permission", "serie_number", "last_authorization", "created_at", "expire_time"]))
    .nullish()
    .transform((x) => {
      const values: string[] = x || ["name", "permission", "token", "serie_number", "last_authorization", "created_at"];
      if (!values.includes("expire_time")) values.push("expire_time");
      return values;
    }),
});

export type IDevice = z.infer<typeof zDevice>;
export type IDeviceCreate = z.input<typeof zDeviceCreate>;
export type IDeviceEdit = z.infer<typeof zDeviceEdit>;
export type IDeviceList = z.infer<typeof zDeviceList>;
export type IDeviceListQuery = z.input<typeof zDeviceListQuery>;
export type IDeviceParameter = z.input<typeof zDeviceParameter>;
export type IDeviceParameterCreate = z.input<typeof zDeviceParameterCreate>;
export type IDeviceParameterList = z.infer<typeof zDeviceParameterList>;
export type IDeviceToken = z.infer<typeof zDeviceToken>;
export type IDeviceTokenCreate = z.input<typeof zDeviceTokenCreate>;
export type IDeviceTokenCreateResponse = z.infer<typeof zDeviceTokenCreateResponse>;
export type IDeviceTokenList = z.input<typeof zDeviceTokenList>;
export type IDeviceTokenListQuery = z.input<typeof zDeviceTokenListQuery>;
export type TDeviceType = z.input<typeof zDeviceType>;
