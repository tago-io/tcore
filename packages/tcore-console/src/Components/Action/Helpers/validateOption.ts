import { IActionOption } from "@tago-io/tcore-sdk/types";
import validateConfigFields from "../../../Helpers/validateConfigFields";
import normalizeOption from "./normalizeType";

/**
 * Validates the action type (`action` field in the database).
 */
function validateOption(option: IActionOption | null, values: any): boolean {
  let errors: any = {};
  let hasError = false;
  const normalizedValues = normalizeOption(option, values);

  if (option?.configs) {
    // custom option selected
    errors = validateConfigFields(option.configs, normalizedValues);
    hasError = errors ? true : false;
  } else if (option?.id === "script") {
    // run analysis option selected
    errors.analyses = normalizedValues?.analyses?.map((x: string) => !x);
    hasError = errors.analyses.some((x: any) => x === true);
  }

  return hasError ? errors : null;
}

export default validateOption;
