import { z } from "zod";

// ! This file is automatically generated. Please don't change it.

/**
 * Types of icons available in the system.
 * Each one must match the corresponding filename in the tcore-console/assets/icons folder.
 */
export const zIcon = z.enum([
  "apple",
  "ban",
  "bars",
  "battery-full",
  "bolt",
  "brush",
  "bucket",
  "bullhorn",
  "caret-down",
  "caret-right",
  "caret-up",
  "certificate",
  "check",
  "chevron-left",
  "chevron-right",
  "circle",
  "clock",
  "cloud",
  "code",
  "cog",
  "comment-dots",
  "connector",
  "copy",
  "cube",
  "cubes",
  "database-double",
  "database",
  "desktop",
  "device-union",
  "device",
  "dice-d20",
  "download",
  "ellipsis-v",
  "envelope",
  "exclamation-circle",
  "exclamation-triangle",
  "external-link-alt",
  "eye",
  "file-alt",
  "file-import",
  "folder",
  "github",
  "globe-americas",
  "globe",
  "grip-horizontal",
  "hashtag",
  "hdd",
  "home",
  "image",
  "io",
  "key",
  "link",
  "linux",
  "list",
  "lock",
  "markdown",
  "memory",
  "microchip",
  "minus",
  "mountain",
  "network-wired",
  "pause",
  "pencil-alt",
  "play",
  "plus-circle",
  "plus",
  "puzzle-piece",
  "question-circle",
  "raspberry-pi",
  "redo",
  "save",
  "scroll",
  "search",
  "shapes",
  "sign-out-alt",
  "snowflake",
  "spinner",
  "star",
  "stopwatch",
  "store",
  "sync-alt",
  "tag",
  "tcore",
  "temperature-high",
  "th-large",
  "times",
  "trash-alt",
  "user-alt",
  "wifi",
  "window-maximize",
  "windows",
]);

export type TIcon = z.infer<typeof zIcon>;
