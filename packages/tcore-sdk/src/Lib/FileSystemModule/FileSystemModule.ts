import TCoreModule from "../TCoreModule/TCoreModule";

/**
 * TODO
 */
class FileSystemModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "filesystem");
  }

  /**
   * TODO
   */
  public async resolveFile(path: string): Promise<any> {
    return Promise.resolve(null);
  }

  /**
   * TODO
   */
  public async resolveFolder(path: string): Promise<any[]> {
    return Promise.resolve([]);
  }
}

export default FileSystemModule;
