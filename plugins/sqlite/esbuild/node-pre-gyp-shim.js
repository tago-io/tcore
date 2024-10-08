// we need this shim file to override @mapbox/node-pre-gyp functionality.
// the original module tries to download the binary if it didn't find it, we
// override that functionality to return the binary file.

const path = require("path");

exports.find = () => {
  return path.join(__dirname, "Binary", "node_sqlite3.node");
};
