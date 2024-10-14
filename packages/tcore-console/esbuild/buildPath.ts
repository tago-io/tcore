import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const dirname_ = dirname(__filename);

const buildPath = join(dirname_, "../build");

export { buildPath };
