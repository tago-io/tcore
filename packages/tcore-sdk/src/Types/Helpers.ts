/**
 * Refines (validates) the order by field of a query.
 */
export function refineOrderBy(enumValues: any): any {
  const validator = (value: any) => {
    try {
      const valueJSON = parseSafe(value, []);
      if (valueJSON.length === 2) {
        enumValues.parse(valueJSON[0]);
        if (valueJSON[1] === "asc" || valueJSON[1] === "desc") {
          return true;
        }
      }
      return false;
    } catch (ex) {
      return false;
    }
  };
  return validator;
}

/**
 * Parses a JSON safely.
 */
export function parseSafe(value: any, fallback: any = {}) {
  try {
    if (value && typeof value === "object") {
      return value;
    }
    const result = JSON.parse(value);
    return result || fallback;
  } catch (ex) {
    return fallback;
  }
}
