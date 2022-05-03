import { IActionOption } from "@tago-io/tcore-sdk/types";

/**
 * Normalizes the action type values by removing unnecessary data and trimming
 * existing fields.
 */
function normalizeOption(option: IActionOption | null, values: any): any {
  if (option?.configs) {
    // custom option selected
    const newValues: any = {};
    for (const config of option.configs) {
      if ("field" in config) {
        newValues[config.field] = values[config.field] || null;
      }
    }
    return newValues;
  } else if (option?.id === "script") {
    // run analysis option selected
    const analyses = values?.analyses?.map((x: any) => x?.id) || [false];
    return { analyses };
  } else if (option?.id === "post") {
    // make a post request
    return {
      url: values?.url || "",
      headers: (values?.headers || [])
        .filter((x: any) => x?.name)
        .filter((x: any) => x.name !== "TagoIO-Retries"),
      fallback_token: values?.fallback_token || "",
      http_post_fallback_enabled: values?.http_post_fallback_enabled || false,
    };
  }

  return values;
}

export default normalizeOption;
