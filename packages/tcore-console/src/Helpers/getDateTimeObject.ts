import { DateTime } from "luxon";

/**
 * Gets the `luxon` DateTime object from an input.
 */
function getDateTimeObject(value?: Date | string | number | null): DateTime | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return DateTime.fromJSDate(value);
  } else if (typeof value === "string") {
    return DateTime.fromISO(value);
  } else if (typeof value === "number") {
    return DateTime.fromMillis(value);
  }
  return null;
}

export default getDateTimeObject;
