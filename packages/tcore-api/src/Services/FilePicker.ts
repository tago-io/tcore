import { IPluginFilesystemItem } from "@tago-io/tcore-sdk/types";
import { invokeFilesystemFunction } from "../Plugins/invokeFilesystemFunction";
import { getModuleList } from "./Plugins";

/**
 */
export async function getFileList(folderPath: string, preferLocalFs?: boolean): Promise<IPluginFilesystemItem[]> {
  if (preferLocalFs) {
    const localFilesystem = getModuleList("filesystem")[0];
    const result = await localFilesystem.invoke("resolveFolder", folderPath);
    return result as IPluginFilesystemItem[];
  } else {
    const result = await invokeFilesystemFunction("resolveFolder", folderPath);
    return result;
  }
}
