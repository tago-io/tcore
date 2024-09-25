import { IPluginListItem } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import {
  Button,
  EButton,
  Icon,
  Tooltip,
  EIcon,
  PluginImage,
  Publisher,
  useApiRequest,
} from "@tago-io/tcore-console";
import semver from "semver";
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
  const { data: plugins } = useApiRequest<IPluginListItem[]>("/plugin");

  const { plugin, onChangeSelectedVersion, installURL, selectedVersion, systemPlatform } = props;

  const systemVersion = status?.version;

  const { id, logo_url, name, platforms, publisher, short_description, compatibility, versions } =
    plugin;

  const installedPluginItem = plugins?.find((x) => String(plugin.id).includes(x.id));
  const isInstalled = installedPluginItem?.version === selectedVersion;

  const runningInCluster = status?.cluster;
  const isClusterCompatible = !runningInCluster || compatibility?.cluster;
  const isVersionCompatible =
    compatibility && semver.satisfies(systemVersion, compatibility.tcore_version);
  const isPlatformCompatible =
    (installURL && platforms?.includes(systemPlatform)) || platforms?.includes("any");

  const isIncompatible = !isClusterCompatible || !isVersionCompatible || !isPlatformCompatible;

  /**
   * Called when the install button is pressed.
   */
  const install = useCallback(() => {
    window.top?.postMessage({ type: "install-plugin", url: installURL }, "*");
  }, [installURL]);

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
  const renderDropdownVersion = (version: string, index: number) => {
    return (
      <option key={version} value={version}>
        {index === 0 ? `v${version} (Latest)` : `v${version}`}
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
            {versions.map(renderDropdownVersion)}
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
            <span>Uninstall</span>
          </Button>
        </Style.Install>
      );
    }

    return (
      <Tooltip text={isInstalled ? `This version is already installed` : ""}>
        <Style.Install disabled={disabled}>
          <Button onClick={install} type={EButton.primary}>
            Install
          </Button>

          {!isClusterCompatible ? (
            <div className="error">
              <Icon icon={EIcon["exclamation-triangle"]} size="10px" />
              <span> This version can&apos;t run in a Cluster instance</span>
            </div>
          ) : !isVersionCompatible ? (
            <div className="error">
              <Icon icon={EIcon["exclamation-triangle"]} size="10px" />
              <span> This version can&apos;t run on TagoCore v{systemVersion}</span>
            </div>
          ) : !isPlatformCompatible ? (
            <div className="error">
              <Icon icon={EIcon["exclamation-triangle"]} size="10px" />
              <span> This version isn&apos;t compatible with this platform</span>
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
