import fs from "node:fs";
import buildPath from "./buildPath.js";
import { version } from "../../../package.json";
import { getSystemName } from "@tago-io/tcore-shared";

const temp = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getSystemName()}</title>
</head>
<body>
  <div id="root"></div>
  <script src="/console/tcore-v${version}.js"></script>
</body>
</html>
`;

try {
  fs.mkdirSync(buildPath);
} catch (ex) {
  //
}

fs.writeFileSync(`${buildPath}/index.html`, temp, { encoding: "utf-8" });
