import { z } from "zod";
import preprocessNumber from "../Helpers/preprocessNumber";

/**
 * Configuration of the application settings.
 */
export const zSettings = z.object({
  database_plugin: z.string().optional(),
  filesystem_plugin: z.string().optional(),
  plugin_folder: z.string().nonempty(),
  plugin_auto_update_enable: z.boolean().optional(),
  plugin_auto_update_check_time: z.preprocess(preprocessNumber, z.number().nullish()),
  plugin_auto_update_last_checked_time: z.string().optional(),
  port: z
    .preprocess((x) => Number(x), z.number())
    .optional()
    .default(8888)
    .or(z.undefined()),
  settings_folder: z.string().optional(),
});

export const zSettingsMetadata = z.object({
  database_plugin_disabled: z.boolean(),
  plugin_folder_disabled: z.boolean(),
  port_disabled: z.boolean(),
});

export type ISettings = z.infer<typeof zSettings>;
export type ISettingsMetadata = z.infer<typeof zSettingsMetadata>;
