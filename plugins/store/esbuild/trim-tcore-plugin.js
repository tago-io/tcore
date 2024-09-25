const whitelist = [
  "tcore-api/build/index.js",
  "tcore-api/build/Helpers/Yaml.js",
  "tcore-api/build/Helpers/Tar/Tar.js",
  "tcore-api/build/Helpers/Platform.js",
  "tcore-api/build/Plugins/PluginID.js",
  "tcore-api/build/Plugins/Install.js",
  "tcore-api/build/Plugins/Uninstall.js",
  "tcore-api/build/Plugins/Host.js",
  "tcore-api/build/Plugins/Plugin/Plugin.js",
  "tcore-api/build/Services/Settings.js",
  "tcore-api/build/Services/Plugins.js",
];

/**
 * Only adds certain tcore-api files in the bundle.
 */
const trimTCorePlugin = {
  name: 'trim-tcore-code-plugin',
  setup(build) {
    build.onLoad({ filter: /tcore-api\/build.*js$/ }, (args) => {
      const isWhitelisted = whitelist.some((x) => args.path.endsWith(x));
      if (isWhitelisted) {
        console.log("Adding tcore-api file to store bundle:", args.path);
        const contents = require("fs").readFileSync(args.path);
        return { contents }
      }

      return { contents: "" };
    });
  },
}

module.exports = trimTCorePlugin;
