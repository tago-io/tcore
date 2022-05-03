import { useTheme } from "styled-components";
import { ESocketResource, IPluginList, IPluginListItem } from "@tago-io/tcore-sdk/types";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { EIcon } from "../Icon/Icon.types";
import useApiRequest from "../../Helpers/useApiRequest";
import { socket } from "../../System/Socket";
import store from "../../System/Store";
import * as Style from "./Sidebar.style";
import Item from "./Item";
import InstallLocalPluginButton from "./InstalLocalPluginButton/InstalLocalPluginButton";
import PluginButton from "./PluginButton/PluginButton";

/**
 * Props.
 */
interface ISidebarProps {
  /**
   * Indicates if the sidebar is open or closed.
   */
  open: boolean;
}

/**
 * This component shows a sidebar on the left side of the page.
 */
function Sidebar(props: ISidebarProps) {
  const { data } = useApiRequest<IPluginList>("/plugin");
  const [plugins, setPlugins] = useState<IPluginList>([]);
  const theme = useTheme();

  const buttons = [
    [
      {
        color: theme.home,
        icon: EIcon.home,
        id: "home",
        text: "Home",
        url: "/console/",
      },
    ],
    [
      {
        color: theme.device,
        icon: EIcon.device,
        id: "devices",
        text: "Devices",
        url: "/console/devices/",
      },
      {
        color: theme.bucket,
        icon: EIcon.bucket,
        id: "buckets",
        text: "Buckets",
        url: "/console/buckets/",
      },
    ],
    [
      {
        text: "Analysis",
        icon: EIcon.code,
        id: "analysis",
        url: "/console/analysis/",
        color: theme.analysis,
      },
      {
        text: "Actions",
        icon: EIcon.bolt,
        id: "actions",
        url: "/console/actions/",
        color: theme.action,
      },
    ],
    [
      {
        text: "Settings",
        icon: EIcon.cog,
        id: "settings",
        url: "/console/settings/",
        color: theme.settings,
      },
    ],
  ];

  for (const plugin of data || []) {
    for (const button of plugin.buttons || []) {
      if (button.type === "sidebar-button") {
        buttons[buttons.length - 1].unshift({
          text: button.name,
          icon: button.icon as EIcon,
          url: `/console/${button.route}`,
          id: button.name,
          color: button.color,
        });
      }
    }
  }

  /**
   * Renders a single plugin.
   */
  const renderPlugin = (item: IPluginListItem) => {
    if (item.hidden) {
      return null;
    }
    return <PluginButton key={item.id} item={item} />;
  };

  /**
   */
  const renderButton = (item: any) => {
    return (
      <Item
        color={item.color}
        icon={item.icon}
        isVertical
        key={item.text}
        testId={item.id}
        text={item.text}
        url={item.url}
      />
    );
  };

  /**
   * Saves the data from the api request in a local state for easier manipulation.
   */
  useEffect(() => {
    if (data) {
      setPlugins([...data]);
    }
  }, [data]);

  /**
   */
  useEffect(() => {
    function onStatus(params: any) {
      if (params.deleted) {
        setPlugins(plugins.filter((x) => x.id !== params.id));
        return;
      }

      const plugin = plugins.find((x) => x.id === params.id);
      if (plugin) {
        plugin.state = params.state;
        plugin.error = params.error;
        setPlugins([...plugins]);
      }
    }

    socket.on("plugin:sidebar", onStatus);
    return () => {
      socket.off("plugin:sidebar", onStatus);
    };
  });

  /**
   * Attaches the events to listen to the plugins.
   */
  useEffect(() => {
    if (store.socketConnected) {
      for (const plugin of plugins) {
        socket.emit("attach", ESocketResource.plugin, plugin.id);
      }
      return () => {
        for (const plugin of plugins) {
          socket.emit("detach", ESocketResource.plugin, plugin.id);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected, plugins.length]);

  return (
    <Style.Container data-testid="sidebar" open={props.open}>
      {data && (
        <>
          <div className="stretch">
            {buttons.map((x, i) => (
              <div className="row" key={i}>
                {x.map(renderButton)}
              </div>
            ))}
            <div style={{ marginTop: "6px" }}>{plugins?.map(renderPlugin)}</div>
          </div>

          <InstallLocalPluginButton />
        </>
      )}
    </Style.Container>
  );
}

export default observer(Sidebar);
