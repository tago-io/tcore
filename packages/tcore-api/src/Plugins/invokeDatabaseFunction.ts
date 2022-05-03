import { getMainDatabaseModule } from "../Services/Plugins";

/**
 * Invokes a function from the main database plugin.
 */
export async function invokeDatabaseFunction(method: string, ...args: any): Promise<any> {
  const module = await getMainDatabaseModule();
  if (!module) {
    throw new Error("Database module doesn't exist or isn't running");
  }

  const result = await module.invoke(method, ...args);
  return result;
}
