import type { IPluginListItem } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import semver from "semver";
import useApiRequest from "../../../../Helpers/useApiRequest";
import Publisher from "../../../Plugins/Common/Publisher/Publisher";
import Button from "../../../Button/Button";
import { EButton } from "../../../Button/Button.types";
import Icon from "../../../Icon/Icon";
import { EIcon } from "../../../Icon/Icon.types";
import Tooltip from "../../../Tooltip/Tooltip";
import PluginImage from "../../../PluginImage/PluginImage";
import * as Style from "./Banner.style";

/**
 * Props.
 */
interface IBannerProps {
  installURL: string;
  onChangeSelectedVersion(version: string): void;
  plugin: any;
  selectedVersion: string;
  systemPlatform?: string;
}

/**
 * The banner at the top of the plugin details page.
 */
function Banner(props: IBannerProps) {
  const { data: status } = useApiRequest<any>("/status");
  // const { data: plugins } = useApiRequest<IPluginListItem[]>("/plugin");
  const { data: installedPlugins } = useApiRequest<Array<string>>("/plugins/installed");

  const { plugin, onChangeSelectedVersion, installURL, selectedVersion } = props;

  const { id, logo_url, name, publisher, short_description, compatibility, version } = plugin;

  const isInstalled = installedPlugins?.includes(id);

  const runningInCluster = status?.cluster;
  const isClusterCompatible = !runningInCluster || compatibility?.cluster;

  const isIncompatible = !isClusterCompatible;

  /**
   * Called when the install button is pressed.
   */
  const install = useCallback(() => {
    window.top?.postMessage({ type: "install-plugin", url: `/plugins/activate/${id}` }, "*");
  }, [id]);

  /**
   * Edits the configuration of the plugin.
   */
  const editConfiguration = useCallback(() => {
    window.top?.postMessage({ type: "set-link", url: `/plugin/${id}` }, "*");
  }, [id]);

  /**
   * Called when the uninstall button is pressed.
   */
  const uninstall = useCallback(() => {
    const pluginID = id;
    window.top?.postMessage({ type: "uninstall-plugin", pluginID }, "*");
  }, [id]);

  /**
   * Renders the dropdown/select version.
   */
  const renderDropdownVersion = (ver: string, index: number) => {
    return (
      <option key={ver} value={ver}>
        {index === 0 ? `v${ver} (Latest)` : `v${ver}`}
      </option>
    );
  };

  /**
   * Renders the information part of the banner.
   */
  const renderInfo = () => {
    return (
      <Style.Info>
        <div className="title">
          <h1>{name}</h1>
          <select value={selectedVersion} onChange={(e) => onChangeSelectedVersion(e.target.value)}>
            {version}
          </select>
        </div>

        {publisher?.name && (
          <div className="publisher">
            <Publisher clickable domain={publisher?.domain} name={publisher?.name} size="medium" />
          </div>
        )}

        {short_description && <div className="description">{short_description}</div>}
      </Style.Info>
    );
  };

  /**
   * Renders the install section.
   */
  const renderInstall = () => {
    const disabled = isIncompatible || isInstalled;

    if (isInstalled) {
      return (
        <Style.Install>
          <Button onClick={editConfiguration} type={EButton.primary}>
            Edit configuration
          </Button>

          <Button
            style={{ padding: "8px 20px", marginTop: "10px" }}
            addIconMargin
            onClick={uninstall}
            type={EButton.danger_outline}
          >
            <Icon icon={EIcon["trash-alt"]} />
            <span>Deactivate</span>
          </Button>
        </Style.Install>
      );
    }

    return (
      <Tooltip text={isInstalled ? `This version is already installed` : ""}>
        <Style.Install disabled={disabled}>
          <Button onClick={install} type={EButton.primary}>
            Activate
          </Button>

          {!isClusterCompatible ? (
            <div className="error">
              <Icon icon={EIcon["exclamation-triangle"]} size="10px" />
              <span> This version can&apos;t run in a Cluster instance</span>
            </div>
          ) : null}
        </Style.Install>
      </Tooltip>
    );
  };

  return (
    <Style.Container>
      <PluginImage width={150} src={logo_url} />

      {renderInfo()}
      {renderInstall()}
    </Style.Container>
  );
}

export default Banner;
