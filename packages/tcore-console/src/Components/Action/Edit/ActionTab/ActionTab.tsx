import { IAction, IPluginModuleListItem } from "@tago-io/tcore-sdk/types";
import { Input } from "../../../..";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import PluginConfigFields from "../../../Plugins/Common/PluginConfigFields/PluginConfigFields";
import ActionFields from "../../Common/ActionFields/ActionFields";
import ConditionTrigger from "../ConditionTrigger/ConditionTrigger";
import ScheduleTrigger from "../ScheduleTrigger/ScheduleTrigger";
import MessageTriggerNotFound from "../ScheduleTrigger/MessageTriggerNotFound/MessageTriggerNotFound";
import { IConditionData, IScheduleData } from "../../Action.types";
import * as Style from "./ActionTab.style";

/**
 * Props.
 */
interface IActionTab {
  action: any;
  conditionData: IConditionData;
  customTrigger?: IPluginModuleListItem;
  data: IAction;
  errors: any;
  onChange: (field: keyof IAction, value: IAction[keyof IAction]) => void;
  onChangeAction: (action: any) => void;
  onChangeConditionData: (conditionData: IConditionData) => void;
  onChangePluginTriggerData: (pluginTriggerData: any) => void;
  onChangeScheduleData: (action: IScheduleData) => void;
  pluginTriggerData: any;
  scheduleData: IScheduleData;
}

/**
 * The action's `Action` tab.
 */
function ActionTab(props: IActionTab) {
  const {
    pluginTriggerData,
    onChangePluginTriggerData,
    customTrigger,
    errors,
    data,
    action,
    onChangeAction,
    scheduleData,
    onChangeScheduleData,
    onChange,
  } = props;

  /**
   * Renders the left section (`Triggers`) of the screen.
   */
  const renderLeftSectionContent = () => {
    if (data.type.includes(":") && !customTrigger) {
      return <MessageTriggerNotFound type={data.type} />;
    } else if (customTrigger) {
      return (
        <PluginConfigFields
          data={customTrigger?.setup?.option?.configs || []}
          errors={errors?.trigger}
          onChangeValues={onChangePluginTriggerData}
          values={pluginTriggerData}
        />
      );
    } else if (data.type === "interval" || data.type === "schedule") {
      return (
        <ScheduleTrigger
          errors={errors}
          onChangeScheduleData={onChangeScheduleData}
          scheduleData={scheduleData}
        />
      );
    } else {
      return (
        <ConditionTrigger
          conditionData={props.conditionData}
          errors={errors}
          onChangeConditionData={props.onChangeConditionData}
        />
      );
    }
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
              error={errors?.name}
              errorMessage="This field requires at least 3 characters"
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter a name that describes the purpose of your action"
              value={data.name}
            />
          </FormGroup>
        </div>

        <ActionFields errors={errors?.action} action={action} onChangeAction={onChangeAction} />
      </>
    );
  };

  return (
    <Style.Container>
      <Style.LeftSection>
        <div className="title">Trigger</div>
        {renderLeftSectionContent()}
      </Style.LeftSection>

      <Style.RightSection>
        <div className="title">Action</div>
        {renderRightSectionContent()}
      </Style.RightSection>
    </Style.Container>
  );
}

export default ActionTab;
