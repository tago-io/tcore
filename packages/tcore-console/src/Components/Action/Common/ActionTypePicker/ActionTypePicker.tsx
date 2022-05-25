import { useCallback } from "react";
import { IPluginConfigField, IPluginModuleList } from "@tago-io/tcore-sdk/types";
import Icon from "../../../Icon/Icon";
import { EIcon } from "../../../Icon/Icon.types";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker";
import { useApiRequest } from "../../../..";
import * as Style from "./ActionTypePicker.style";

interface IOption {
  description?: string;
  icon?: string;
  name?: string;
  configs?: IPluginConfigField[];
  id: string;
}

/**
 * Options to be displayed in the component.
 */
const defaultOptions: IOption[] = [
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
 * Props.
 */
interface IActionTypePicker {
  /**
   * Option object.
   */
  value?: IOption;
  /**
   * Called when a new option gets picked.
   */
  onChange: (value: IOption) => void;
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 * Picker for the type of action.
 */
function ActionTypePicker(props: IActionTypePicker) {
  const { data: options } = useApiRequest<IPluginModuleList>("/module?type=action-type");
  const { error, optionsPosition } = props;

  const mappedPluginOptions: IOption[] = options?.map((x) => ({
    configs: x.setup.option?.configs || [],
    description: x.setup.option?.description,
    icon: x.setup.option?.icon,
    id: `${x.pluginID}:${x.setup.id}`,
    name: x.setup.name,
  }));

  /**
   * Renders a single row.
   */
  const renderPluginImage = (item: IOption) => {
    const idSplit = item.id.split(":");
    const pluginMd5 = idSplit[0];
    const moduleID = idSplit[1];
    return <img src={`/images/${pluginMd5}/action/${moduleID}`} />;
  };

  /**
   * Renders a single row.
   */
  const renderOption = (item: IOption) => {
    const isModule = item.id.includes(":");
    return (
      <Style.Item>
        <div className="content">
          <div className="icon-container">
            {isModule ? renderPluginImage(item) : <Icon icon={item.icon as EIcon} size="25px" />}
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
      const allOptions = [...defaultOptions, ...mappedPluginOptions];
      const response = allOptions.find((x) => x.id === id);
      return response;
    },
    [mappedPluginOptions]
  );

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback(
    (query: string, page: number) => {
      if (page > 1) {
        return [];
      }

      const allOptions = [...defaultOptions, ...mappedPluginOptions];
      return allOptions.filter((x) => {
        return (
          String(x.description).toLowerCase().includes(query) ||
          String(x.name).toLowerCase().includes(query)
        );
      });
    },
    [mappedPluginOptions]
  );

  return (
    <OptionsPicker<IOption>
      doesRequest
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      optionsPosition={optionsPosition}
      value={props.value}
      error={error}
    />
  );
}

export default ActionTypePicker;
