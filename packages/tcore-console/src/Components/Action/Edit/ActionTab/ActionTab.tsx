import { IAction, IActionOption, IActionType } from "@tago-io/tcore-sdk/types";
import Accordion from "../../../Accordion/Accordion";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import VariableCondition from "../../../VariableCondition/VariableCondition";
import ActionFields from "../../Common/ActionFields/ActionFields";
import PluginConfigFields from "../../../Plugins/Common/PluginConfigFields/PluginConfigFields";
import DeviceRadio from "../../Common/DeviceRadio/DeviceRadio";
import * as Style from "./ActionTab.style";

/**
 * Props.
 */
interface IActionTabProps {
  /**
   * Action's form data.
   */
  data: IAction;
  /**
   */
  trigger: any;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IAction, value: IAction[keyof IAction]) => void;
  /**
   */
  onChangeTrigger: (trigger: any) => void;
  /**
   * Additional options provided by plugins.
   */
  options?: IActionOption[];
  option: any;
  onChangeOption: any;
  optionFields: any;
  onChangeOptionFields: any;
  device?: any;
  tag?: any;
  deviceType?: any;
  onChangeDevice: any;
  onChangeTag: any;
  onChangeDeviceType: any;
  types?: any;
  errors: any;
  /**
   * Custom type selected.
   */
  customType: IActionType;
}

/**
 * The action's `Action` tab.
 */
function ActionTab(props: IActionTabProps) {
  const {
    option,
    onChangeOption,
    optionFields,
    onChangeOptionFields,
    onChangeTag,
    onChangeDeviceType,
    onChangeDevice,
    tag,
    deviceType,
    device,
    data,
    options,
    trigger,
    errors,
    customType,
    onChangeTrigger,
    onChange,
  } = props;

  const isCustomType = !!customType;

  /**
   * Renders a section's title.
   */
  const renderSectionTitle = (title: string) => {
    return <div className="title">{title}</div>;
  };

  /**
   */
  const renderCustomLeftSectionContent = () => {
    const configs = customType?.configs || [];
    return (
      <>
        {customType?.showDeviceSelector && (
          <DeviceRadio
            device={device}
            deviceType={deviceType}
            error={errors.device_info}
            onChangeDevice={onChangeDevice}
            onChangeDeviceType={onChangeDeviceType}
            onChangeTag={onChangeTag}
            tag={tag}
          />
        )}

        <PluginConfigFields
          errors={errors?.trigger}
          data={configs}
          values={trigger}
          onChangeValues={onChangeTrigger}
        />
      </>
    );
  };

  /**
   * Renders the left section (`Triggers`) of the screen.
   */
  const renderLeftSectionContent = () => {
    if (isCustomType) {
      return renderCustomLeftSectionContent();
    }

    return (
      <>
        <DeviceRadio
          device={device}
          deviceType={deviceType}
          error={errors.device_info}
          onChangeDevice={onChangeDevice}
          onChangeDeviceType={onChangeDeviceType}
          onChangeTag={onChangeTag}
          tag={tag}
        />

        <div>
          <Accordion
            icon={EIcon.cog}
            description="If one of the conditions match, the action will be triggered."
            title="Trigger"
            isAlwaysOpen
          >
            <VariableCondition
              name="Trigger"
              data={trigger?.conditions || []}
              onChange={(e) => onChangeTrigger({ ...trigger, conditions: e })}
            />
          </Accordion>
        </div>
      </>
    );
  };

  /**
   * Renders the left section (`Action`) of the screen.
   */
  const renderRightSectionContent = () => {
    return (
      <>
        <div>
          <FormGroup icon={EIcon["pencil-alt"]} label="Name">
            <Input
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter a name that describes the purpose of your action"
              error={errors.name}
              errorMessage="This field requires at least 3 characters"
            />
          </FormGroup>
        </div>

        <ActionFields
          errors={errors.option}
          onChangeOption={onChangeOption}
          onChangeOptionFields={onChangeOptionFields}
          option={option}
          optionFields={optionFields}
          options={options}
        />
      </>
    );
  };

  return (
    <Style.Container>
      <Style.LeftSection>
        {renderSectionTitle("Trigger")}
        {renderLeftSectionContent()}
      </Style.LeftSection>

      <Style.RightSection>
        {renderSectionTitle("Action")}
        {renderRightSectionContent()}
      </Style.RightSection>
    </Style.Container>
  );
}

export default ActionTab;
