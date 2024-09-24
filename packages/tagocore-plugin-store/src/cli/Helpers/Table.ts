import chalk from "chalk";

/**
 */
export async function printTable(data: any[]) {
  const lengths = {};

  for (const item of data) {
    for (const key in item) {
      const value = String(item[key]);
      const column = key;
      lengths[key] = Math.max(value.length, column.length, lengths[key] || 0);
    }
  }

  let total = 1;

  if (data[0]) {
    const row: string[] = ["│"];
    for (const key in data[0]) {
      const length = lengths[key];
      const value = String(key).padEnd(length, " ");
      row.push(value);
      row.push("│");

      total += value.length + 3;
    }

    console.log("┌" + "─".repeat(total - 2) + "┐");
    console.log(...row);
    console.log("├" + "─".repeat(total - 2) + "┤");
  }

  for (const item of data) {
    const row: string[] = ["│"];

    for (const key in item) {
      const length = lengths[key];
      const value = String(item[key]).padEnd(length, " ");

      if (typeof item[key] === "number") {
        row.push(chalk.yellow(value));
      } else if (typeof item[key] === "string") {
        row.push(value);
      } else {
        row.push(value);
      }

      row.push("│");
    }

    console.log(...row);
  }

  if (total > 1) {
    console.log("└" + "─".repeat(total - 2) + "┘");
  }
}
