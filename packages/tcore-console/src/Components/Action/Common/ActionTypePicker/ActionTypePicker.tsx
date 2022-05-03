import { useCallback } from "react";
import { IActionOption } from "@tago-io/tcore-sdk/types";
import Icon from "../../../Icon/Icon";
import { EIcon } from "../../../Icon/Icon.types";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker";
import * as Style from "./ActionTypePicker.style";

/**
 * Props.
 */
interface IActionTypePicker {
  /**
   * Device object.
   */
  value?: IActionOption;
  /**
   * Called when a new device gets picked.
   */
  onChange: (value: IActionOption) => void;
  /**
   * Additional options provided by plugins.
   */
  options?: IActionOption[];
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 * Options to be displayed in the component.
 */
const defaultOptions: IActionOption[] = [
  {
    description: "Run an analysis whenever this action is triggered",
    icon: EIcon.code,
    id: "script",
    name: "Run Analysis",
  },
  {
    description: "Will send a POST request to an endpoint whenever this action is triggered",
    icon: EIcon["network-wired"],
    id: "post",
    name: "Post data to endpoint using HTTP",
  },
  {
    description: "Insert the data from the device into TagoIO",
    icon: EIcon.io,
    id: "tagoio",
    name: "Insert data into TagoIO",
  },
];

/**
 * Picker for the type of action.
 */
function ActionTypePicker(props: IActionTypePicker) {
  const { options, optionsPosition } = props;

  /**
   * Renders a single row.
   */
  const renderPluginImage = (item: IActionOption) => {
    const idSplit = item.id.split(":");
    const pluginMd5 = idSplit[0];
    const pluginID = idSplit[1];
    return <img src={`/images/${pluginMd5}/action/${pluginID}`} />;
  };

  /**
   * Renders a single row.
   */
  const renderOption = (item: IActionOption) => {
    const isCustom = options?.includes(item);
    return (
      <Style.Item>
        <div className="content">
          <div className="icon-container">
            {isCustom ? renderPluginImage(item) : <Icon icon={item.icon as any} size="25px" />}
          </div>

          <div className="info">
            <div className="title">{item.name}</div>
            <div className="description">{item.description}</div>
          </div>
        </div>
      </Style.Item>
    );
  };

  /**
   * Resolves an option by an ID.
   * This transforms the ID into an object.
   */
  const resolveOptionByID = useCallback(
    async (id: string | number) => {
      const allOptions = [...defaultOptions, ...(options || [])];
      const response = allOptions.find((x) => x.id === id);
      return response;
    },
    [options]
  );

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback(
    (query: string, page: number) => {
      if (page > 1) {
        return [];
      }

      const allOptions = [...defaultOptions, ...(options || [])];
      return allOptions.filter((x) => {
        return (
          String(x.description).toLowerCase().includes(query) ||
          String(x.name).toLowerCase().includes(query)
        );
      });
    },
    [options]
  );

  return (
    <OptionsPicker<IActionOption>
      doesRequest
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      optionsPosition={optionsPosition}
      value={props.value}
    />
  );
}

export default ActionTypePicker;
