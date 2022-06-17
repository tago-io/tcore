import { createServer } from "http";
import path from "path";
import express from "express";
import boxen from "boxen";
import cors from "cors";
import chalk from "chalk";
import ora from "ora";
import compression from "compression";
import method_override from "method-override";
import { getSystemName } from "@tago-io/tcore-shared";
import { startAllPlugins } from "./Plugins/Host";
import AccountController from "./Controllers/Account/Account";
import SystemController from "./Controllers/System";
import DeviceController from "./Controllers/Device/Device";
import ActionController from "./Controllers/Action";
import AnalysisController from "./Controllers/Analysis";
import SummaryController from "./Controllers/Summary";
import PluginsController, { resolvePluginImage, resolvePluginImage2 } from "./Controllers/Plugins";
import FileController from "./Controllers/File";
import LogsController from "./Controllers/Logs";
import DeviceDataController from "./Controllers/DeviceData/DeviceData";
import TagController from "./Controllers/Tag";
import SettingsController from "./Controllers/Settings";
import StatisticController from "./Controllers/Statistic";
import { getMainSettings } from "./Services/Settings";
import HardwareController from "./Controllers/Hardware";
import { setupSocketServer } from "./Socket/SocketServer";
import { shutdown } from "./Helpers/shutdown";
import { getLocalIPs } from "./Services/Hardware";
import { getModuleList } from "./Services/Plugins";
import { startCallbackInterval } from "./Plugins/Worker/Worker";
import { startActionScheduleTimer } from "./Services/ActionScheduler";

const app = express();
const httpServer = createServer(app);
const consolePath = path.join(__dirname, "../../tcore-console/build");

/**
 * Sets up express and its configuration.
 */
async function setupExpress() {
  app.use(cors());
  app.disable("x-powered-by");
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.text({ limit: "5mb" }));

  app.use(method_override("X-HTTP-Method")); // Microsoft
  app.use(method_override("X-HTTP-Method-Override")); // Google/GData
  app.use(method_override("X-Method-Override")); // IBM
  app.use(method_override("_method")); // QueryString
}

/**
 * Sets up the routes of express.
 */
async function setupExpressRoutes() {
  AccountController(app);
  SystemController(app);
  DeviceController(app);
  SummaryController(app);
  ActionController(app);
  AnalysisController(app);
  PluginsController(app);
  FileController(app);
  LogsController(app);
  DeviceDataController(app);
  SettingsController(app);
  StatisticController(app);
  HardwareController(app);
  TagController(app);

  app.use("/console", express.static(consolePath, { index: "./index.html" }));

  app.get("/", (req, res) => {
    res.redirect("/console");
  });

  app.get("/console/*", (req, res) => {
    res.header("content-type", "text/html");
    res.sendFile(`${consolePath}/index.html`);
  });

  app.get("/images/:plugin/:type/:identifier?", resolvePluginImage);
  app.get("/images2/:plugin/*", resolvePluginImage2);

  app.options("*", (req, res) => {
    const defaultHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Cache-Control, Pragma, X-Requested-With, Authorization, Account-Token, Device-Token, Token",
      "Content-Type": "application/json; charset=utf-8",
    };
    // const headers = { ...defaultHeaders };
    res.set(defaultHeaders);
  });

  app.use((err, req, res, next) => {
    if (err.stack.match(/body-parser/)) {
      res.status(400).send({
        status: false,
        result: {
          request_error: err.message,
          request_body: err.body,
          server_response: "Malformed request syntax",
        },
      });
    } else {
      next();
    }
  });
}

/**
 * Sets up the plugin pages.
 */
async function setupPluginPages() {
  const modules: any = getModuleList("page");

  for (const module of modules) {
    const fullPath = module.plugin.folder;
    const assetsPath = path.join(fullPath, module.setup.assets);
    const fullRoute = `/pages/${module.setup.route.substring(1)}`;
    app.use(fullRoute, express.static(assetsPath, { index: "./index.html" }));
  }

  app.use((req, res) => {
    res.status(404);
    res.send({ status: false, message: "Route Not Found" });
  });
}

/**
 * Starts listening on the application port.
 */
async function listenOnApplicationPort() {
  const settings = await getMainSettings();
  const port = Number(settings.port);

  const systemName = getSystemName();

  httpServer
    .listen(port, () => {
      const lines = [`${systemName} is ready!`, "", `- Local:             http://localhost:${port}`];

      const netAddresses = getLocalIPs();
      if (netAddresses[0]) {
        lines.push(`- On your network:   http://${netAddresses[0]}:${port}`);
      }

      console.log("");
      console.log(chalk.green(boxen(lines.join("\n"), { padding: 1 })));
      console.log("");
    })
    .on("error", () => {
      ora(chalk.redBright(`Could not start ${systemName} on port ${port}`)).fail();
      process.exit(1);
    });
}

/**
 * Starts the application.
 */
export async function startServer() {
  ora(`Started ${getSystemName()}`).succeed();

  startCallbackInterval();

  await setupExpress();
  await setupExpressRoutes();
  await setupSocketServer(httpServer);

  await startAllPlugins();
  await setupPluginPages();

  await listenOnApplicationPort();
  startActionScheduleTimer();

  process.on("SIGTERM", () => shutdown(httpServer));
  process.on("SIGINT", () => shutdown(httpServer));
}

const watchMode = process.argv.some((x) => x.includes("ts-node"));
if (watchMode) {
  startServer();
}
