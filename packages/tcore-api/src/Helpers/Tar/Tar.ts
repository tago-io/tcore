import zlib from "zlib";
import fs from "fs";
import tar from "tar";

/**
 * Extracts a tar into a folder.
 */
export async function extractTar(tarPath: string, destination: string, useGzip = false): Promise<void> {
  // creates the destination folder if it doesn't exist
  await fs.promises.mkdir(destination, { recursive: true });

  return await new Promise((resolve, reject) => {
    let stream: any = fs.createReadStream(tarPath);

    if (useGzip) {
      stream = stream.pipe(zlib.createGunzip());
    }

    stream
      .pipe(tar.extract({ C: destination }))
      .on("error", reject)
      .on("finish", resolve);
  });
}

/**
 * Peeks a tar file without extracting it.
 */
export async function peekTarFile(tarPath: string, fileName: string): Promise<Uint8Array[]> {
  const data: Uint8Array[] = [];

  /**
   * Called for each file inside of the tar.
   */
  const onEntry = (entry: any) => {
    if (entry.path === `./${fileName}` || entry.path === fileName) {
      entry.on("data", (chunk: Uint8Array) => data.push(chunk));
    }
  };

  return await new Promise((resolve) => {
    tar.list({ file: tarPath, onentry: onEntry }, [], () => resolve(data));
  });
}
