import os from "os";
import path from "path";

/**
 * Config file path to save the token.
 */
const CONFIG_FILEPATH = path.join(os.homedir(), ".tcorerc");

/**
 * File that contains globs that should be ignored.
 */
const TCOREIGNORE_FILENAME = ".tcoreignore";

/**
 * Default OUT folder.
 */
const DEFAULT_OUT_FOLDERNAME = ".tcore";

export { TCOREIGNORE_FILENAME, DEFAULT_OUT_FOLDERNAME, CONFIG_FILEPATH };
