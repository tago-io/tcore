#!/usr/bin/env node

import { program } from "commander";
import { login } from "./Commands/Login";
import { logout } from "./Commands/Logout";
import { pack } from "./Commands/Pack";
import { publish } from "./Commands/Publish";
import { whoAmI } from "./Commands/WhoAmI";

program.command("whoami").description("display account name").action(whoAmI);

program.command("logout").description("logs out of the plugin store").action(logout);

program
  .command("login")
  .option("-u, --email <value>", "Email of your TagoIO Account")
  .option("-p, --password <value>", "Password of your TagoIO Account")
  .description("logs into the plugin store")
  .action(login);

program
  .command("pack")
  .option("--filename <value>", "Name of the packaged file")
  .option("-f, --force", "Forces pack even with errors")
  .option("-t, --target <id...>", "Target to pack for")
  .option("-o, --out <path>", "Output folder")
  .description("creates a .tcore file from a package")
  .action(pack);

program
  .command("publish")
  .option("-f, --force", "Forces pack even with errors")
  .option("-o, --out <path>", "Output folder")
  .option("-p, --publisher <profile_id>", "ID of the TagoIO Profile to be used as the publisher")
  .option("-v, --visible <boolean>", "Boolean to indicate if the plugin should be publicly visible or not")
  .option("--only-publish", "Don't pack, only publish existing .tcore files")
  .description("publishes a package to the Plugin Store")
  .action(publish);

program.parse();
