import { IDevice } from "@tago-io/tcore-sdk/types";

/**
 * Separate the data retention fields into two separate fields.
 */
function separateDataRetention(device: IDevice) {
  if (!device.data_retention || device.data_retention === "forever") {
    return { value: "1", unit: "forever" };
  } else {
    const splitted = String(device.data_retention)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace("s", "")
      .split(" ");
    const firstPart = splitted[0];
    const secondPart = splitted[1];

    if (["day", "week", "month", "quarter", "year"].indexOf(secondPart) >= 0) {
      return { value: firstPart, unit: secondPart };
    }
  }

  return { value: "1", unit: "month" };
}

export default separateDataRetention;
