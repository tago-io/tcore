// @ts-ignore
import data from "../../../../data.json";

/**
 */
function getSystemSlug() {
  return data.slug;
}

/**
 */
function getSystemName() {
  return data.name;
}

export { getSystemSlug, getSystemName };
