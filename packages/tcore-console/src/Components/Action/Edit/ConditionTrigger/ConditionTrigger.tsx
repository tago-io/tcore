import { Accordion, EIcon } from "../../../..";
import VariableCondition from "../../../VariableCondition/VariableCondition";
import DeviceRadio from "./DeviceRadio/DeviceRadio";

function ConditionTrigger(props: any) {
  const { errors, conditionData, onChangeConditionData } = props;

  return (
    <>
      <DeviceRadio
        device={conditionData.device}
        deviceType={conditionData.type}
        onChangeDevice={(device) => onChangeConditionData({ ...conditionData, device })}
        onChangeDeviceType={(type) => onChangeConditionData({ ...conditionData, type })}
        onChangeTag={(tag) => onChangeConditionData({ ...conditionData, tag })}
        tag={conditionData.tag}
        errors={errors}
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
            data={conditionData?.conditions || []}
            errors={errors?.conditions}
            onChange={(e) => onChangeConditionData({ ...conditionData, conditions: e })}
          />
        </Accordion>
      </div>
    </>
  );
}

export default ConditionTrigger;
