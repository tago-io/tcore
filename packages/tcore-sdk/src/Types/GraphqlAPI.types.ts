import { z } from "zod";

/**
 * Configuration of a version item of TCore.
 */
export const zTCoreVersionListItem = z.object({
  released_at: z.date(),
  version: z.string(),
  platforms: z.array(z.string()),
});

export type ITCoreVersionListItem = z.infer<typeof zTCoreVersionListItem>;
