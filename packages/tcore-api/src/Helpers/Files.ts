import fs from "fs";
import path from "path";

/**
 * Removes directory recursively.
 */
async function rmdir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  if (!dir || dir === "/") {
    return;
  }

  const list = await fs.promises.readdir(dir);
  for (let i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (filename == "." || filename == "..") {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      await rmdir(filename);
    } else {
      // rm filename
      await fs.promises.unlink(filename);
    }
  }

  await fs.promises.rmdir(dir);
}

export { rmdir };
