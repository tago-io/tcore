import fs from "fs";
import path from "path";
import os from "os";
import si from "systeminformation";

interface ITransformedFiles {
  name: string;
  path: string;
  is_folder: boolean;
  children: ITransformedFiles[];
}

function sortFiles(a, b): number {
  if (a.is_folder && !b.is_folder) {
    return -1;
  }
  if (!a.is_folder && b.is_folder) {
    return 1;
  }
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

/**
 */
async function isDirectory(file: string): Promise<boolean> {
  try {
    const stat = await fs.promises.lstat(file);
    const isDir = stat.isDirectory();
    return isDir;
  } catch (ex) {
    return false;
  }
}

/**
 */
async function transformFiles(root: string, paths: string[]): Promise<ITransformedFiles[]> {
  const transformed: any[] = [];

  for (const item of paths) {
    transformed.push({
      name: item,
      path: root ? path.join(root, item) : item,
      is_folder: await isDirectory(root ? path.join(root, item) : item),
      children: [],
    });
  }

  transformed.sort(sortFiles);

  return transformed;
}

/**
 */
async function getFileSystems() {
  if (os.platform() === "win32") {
    const mounts = await si.fsSize();
    return mounts.map((x) => x.mount);
  } else {
    return ["/"];
  }
}

/**
 */
export async function getFileList(filter: string): Promise<ITransformedFiles[]> {
  const fileSystems = await transformFiles("", await getFileSystems());

  const filterArray = filter.split(/\/|\\/g).filter((x) => x);
  if (os.platform() !== "win32") {
    filterArray.unshift("/");
  }

  const isExistingFile = filter && fs.existsSync(filter) && !(await isDirectory(filter));
  if (isExistingFile) {
    filterArray.pop();
  }

  const accumulated: string[] = [];
  let last: any = fileSystems;

  for (const folder of filterArray) {
    accumulated.push(folder);
    let accumulatedString = accumulated.join(path.sep).replace(/\/\//g, "/");
    if (accumulatedString.endsWith(":")) {
      accumulatedString += path.sep;
    }

    const subFolders = await fs.promises.readdir(accumulatedString).catch(() => []);

    last = last?.find((x) => x.name === folder);
    if (last) {
      last.children = await transformFiles(accumulatedString, subFolders).catch(() => []);
      last = last.children;
    }
  }

  if (fileSystems.length === 1) {
    return fileSystems[0].children;
  }

  return fileSystems;
}
