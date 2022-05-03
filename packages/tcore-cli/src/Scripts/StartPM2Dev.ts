// This script is the PM2 Start script.
// It just starts the api server.

// ! This script only runs in dev mode with Node.js
// ? It will not run in production mode with PKG. To understand more about how
// ? it works, check the `Start.ts` file

import * as API from "@tago-io/tcore-api";

API.startServer();
