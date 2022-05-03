import { IActionOption } from "@tago-io/tcore-sdk/types";
import { useTheme } from "styled-components";
import { EIcon } from "../../../Icon/Icon.types";
import IconRadio from "../../../IconRadio/IconRadio";
import Icon from "../../../Icon/Icon";
import useApiRequest from "../../../../Helpers/useApiRequest";

/**
 * Props.
 */
interface ITypeRadioProps {
  /**
   * The selected value.
   */
  value: string;
  /**
   * Called when the value changes.
   */
  onChange: (value: string) => void;
}

/**
 * Shows a list of possible action types.
 * This shows the default list and all the plugin options too.
 */
function TypeRadio(props: ITypeRadioProps) {
  const { data } = useApiRequest<IActionOption[]>("/action-triggers");
  const { value, onChange } = props;
  const theme = useTheme();

  /**
   * Renders the options.
   */
  const renderOptions = () => {
    const options = [
      {
        color: value === "variable" ? theme.action : theme.font,
        description: "Triggered when the selected variables meet certain conditions.",
        icon: EIcon.database,
        label: "Variable",
        value: "variable",
      },
    ];

    for (const item of data || []) {
      options.push({
        color: value === item.id ? theme.action : theme.font,
        description: item.description as string,
        icon: EIcon.cog,
        label: item.name,
        value: item.id,
      });
    }

    return options;
  };

  return (
    <fieldset>
      <legend>
        <Icon icon={EIcon.cog} />
        <span>Select a trigger</span>
      </legend>

      <IconRadio value={value} onChange={onChange} options={renderOptions()} />
    </fieldset>
  );
}

export default TypeRadio;
