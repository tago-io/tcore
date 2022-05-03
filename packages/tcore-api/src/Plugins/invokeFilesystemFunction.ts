import { getMainFilesystemModule } from "../Services/Plugins";

/**
 * TODO
 */
export async function invokeFilesystemFunction(method: string, ...args: any): Promise<any> {
  const module = await getMainFilesystemModule();
  if (!module) {
    throw new Error("Filesystem module doesn't exist or isn't running");
  }

  const result = await module.invoke(method, ...args);
  return result;
}
