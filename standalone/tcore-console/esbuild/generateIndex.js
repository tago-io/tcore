/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const buildPath = require("./buildPath");
const version = require("../../../package.json").version;
const { getSystemName } = require("@tago-io/tcore-shared");

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
