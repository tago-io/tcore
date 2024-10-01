import { SidebarButtonModule, PageModule } from "@tago-io/tagocore-internal-sdk";
import { ServiceModule } from "@tago-io/tcore-sdk";
import { getAllInsidePlugins, getDatabaseList, getInstallURLs } from "./Requests";

/**
 * Retrieves the install URLs of a plugin.
 */
new ServiceModule({ id: "get-install-urls", name: "Plugin Install URL" }).onCall = getInstallURLs;

/**
 * Retrieves a list of database plugins.
 */
new ServiceModule({ id: "get-database-list", name: "Database Plugin List" }).onCall = getDatabaseList;

/**
 * Adds the 'store' button in the sidebar.
 */
new SidebarButtonModule({
  id: "plugin-store-button",
  name: "Store button",
  option: {
    icon: "store",
    color: "#337ab7",
    text: "Store",
    position: 6,
    action: {
      type: "open-url",
      url: "/pluginstore",
    },
  }
});

/**
 * Default list page.
 */
new PageModule({
  id: "main-page",
  route: "/pluginstore",
  assets: "./build/front",
  name: "Main page",
});

/**
 * Info/details page.
 */
new PageModule({
  id: "others",
  route: "/pluginstore/*",
  assets: "./build/front",
  name: "Details page",
});

