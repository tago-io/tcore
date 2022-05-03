import { useLocation } from "react-router";
import Icon from "../Icon/Icon";
import { EIcon } from "../Icon/Icon.types";
import PluginImage from "../PluginImage/PluginImage";
import * as Style from "./Sidebar.style";

/**
 * Props.
 */
interface IItemProps {
  color: string;
  text: string;
  icon?: EIcon;
  url: string;
  isPlugin?: boolean;
  isVertical?: boolean;
  testId?: string;
  pluginID?: string;
  disabled?: boolean;
  description?: string;
  error?: boolean;
}

/**
 * A single sidebar item (button).
 */
function Item(props: IItemProps) {
  const loc = useLocation();
  const {
    testId,
    error,
    color,
    description,
    isVertical,
    disabled,
    url,
    icon,
    text,
    isPlugin,
    pluginID,
  } = props;

  const newUrl = String(url).replace(/\/\//g, "/");

  const currentPath = loc.pathname;
  const selected = newUrl === "/console/" ? currentPath === newUrl : currentPath.startsWith(newUrl);

  return (
    <Style.Item
      to={newUrl}
      $isVertical={isVertical}
      color={color}
      selected={selected}
      data-testid={testId}
      disabled={disabled}
    >
      {isPlugin ? (
        <div style={{ opacity: error ? 0.65 : 1 }}>
          <PluginImage src={`/images/${pluginID}/icon`} width={40} />
        </div>
      ) : icon ? (
        <Icon size="18px" icon={icon} />
      ) : null}

      <span style={{ display: "flex", opacity: error ? 0.65 : 1 }}>{text}</span>

      {description && (
        <div style={{ marginTop: 0 }} className="description">
          {description}
        </div>
      )}

      {error && (
        <div
          style={{
            position: "relative",
            top: "1px",
            marginLeft: "5px",
          }}
        >
          <Icon icon={EIcon["exclamation-triangle"]} size="10px" color="red" />
        </div>
      )}
    </Style.Item>
  );
}

export default Item;
