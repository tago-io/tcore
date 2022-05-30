import { useCallback } from "react";
import moment from "moment";
import { DateTime } from "luxon";
import { EIcon, FormGroup, Input } from "../../../../..";
import Select from "../../../../Select/Select";
import FlexRow from "../../../../FlexRow/FlexRow";
import InputTime from "../../../../InputTime/InputTime";
import * as Style from "../RecurrenceOptions.style";
import WeekdayButton from "../WeekdayButton/WeekdayButton";
import { getCronFromScheduleData } from "../../Logic/getCronFromScheduleData";
import CronTooComplexMessage from "../MessageCronTooComplex/MessageCronTooComplex";
import { IScheduleData } from "../../../Action.interface";

/**
 * Props.
 */
interface IBasicCron {
  /**
   * Error of the fields.
   */
  errors?: any;
  /**
   * Schedule data of the action.
   */
  scheduleData: IScheduleData;
  /**
   * Function to change the schedule data object.
   */
  onChangeScheduleData: (action: IScheduleData) => void;
}

function BasicCron(props: IBasicCron) {
  const { errors, scheduleData, onChangeScheduleData } = props;
  const { repeat_unit, repeat_type, repeat_date, repeat_hour } = scheduleData;
  const repeatWeekdays: any = scheduleData.repeat_weekdays;

  const onChange = useCallback(
    (field: keyof IScheduleData, value: IScheduleData[keyof IScheduleData]) => {
      (scheduleData as any)[field] = value;
      scheduleData.cron = getCronFromScheduleData(scheduleData);
      onChangeScheduleData({ ...scheduleData });
    },
    [scheduleData, onChangeScheduleData]
  );

  /**
   * Renders one of the weekday buttons.
   */
  const renderWeekdayButton = (text: string) => {
    return (
      <WeekdayButton
        pressed={repeatWeekdays[text] || false}
        text={text}
        onChange={(e: boolean) => {
          const weekdays = { ...repeatWeekdays, [text]: e };
          const hasOne = Object.keys(weekdays).find((x) => weekdays[x]);
          if (hasOne) {
            onChange("repeat_weekdays", weekdays);
          }
        }}
      />
    );
  };

  const showWeekDays =
    (repeat_type === "day" && Number(repeat_unit) <= 1) || repeat_type === "week";

  const hastAtLeastOneWeekday = Object.keys(repeatWeekdays || {}).find((x) => repeatWeekdays[x]);
  if (showWeekDays && !hastAtLeastOneWeekday) {
    // we are showing the weekdays but none are selected. In this case we need
    // to select by default the current one we are in.
    repeatWeekdays[DateTime.now().weekdayLong] = true;
  }

  if (!scheduleData.canRender) {
    // Cron is too complex to be rendered
    return <CronTooComplexMessage />;
  }

  return (
    <div style={{ margin: "0px -15px", paddingTop: "1rem" }}>
      <Style.Field width="220px">
        <FormGroup icon={EIcon["sync-alt"]} label="Repeat every">
          <FlexRow>
            <Input
              value={repeat_unit || ""}
              error={errors?.repeat_unit}
              onChange={(e) => onChange("repeat_unit", Number(e.target.value) || 0)}
              style={{
                width: "50%",
                marginRight: "-1px",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              type="number"
            />

            <Select
              value={repeat_type}
              onChange={(e) => onChange("repeat_type", e.target.value)}
              style={{
                width: "50%",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              options={[
                { value: "day", label: `Day${Number(repeat_unit) === 1 ? "" : "s"}` },
                { value: "week", label: `Week${Number(repeat_unit) === 1 ? "" : "s"}` },
                { value: "month", label: `Month${Number(repeat_unit) === 1 ? "" : "s"}` },
              ]}
            />
          </FlexRow>
        </FormGroup>
      </Style.Field>

      {(repeat_type === "month" || repeat_type === "year") && (
        <Style.Field width="200px">
          <FormGroup icon={EIcon.flag} label="Repeat on month day">
            <Select
              value={repeat_date}
              onChange={(e) => onChange("repeat_date", e.target.value)}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
                { value: "6", label: "6" },
                { value: "7", label: "7" },
                { value: "8", label: "8" },
                { value: "9", label: "9" },
                { value: "10", label: "10" },
                { value: "11", label: "11" },
                { value: "12", label: "12" },
                { value: "13", label: "13" },
                { value: "14", label: "14" },
                { value: "15", label: "15" },
                { value: "16", label: "16" },
                { value: "17", label: "17" },
                { value: "18", label: "18" },
                { value: "19", label: "19" },
                { value: "20", label: "20" },
                { value: "20", label: "20" },
                { value: "21", label: "21" },
                { value: "22", label: "22" },
                { value: "23", label: "23" },
                { value: "24", label: "24" },
                { value: "25", label: "25" },
                { value: "26", label: "26" },
                { value: "27", label: "27" },
                { value: "28", label: "28" },
                { value: "29", label: "29" },
                { value: "30", label: "30" },
                { value: "31", label: "31" },
              ]}
            ></Select>
          </FormGroup>
        </Style.Field>
      )}

      <Style.Field width="250px">
        <FormGroup icon={EIcon.clock} label="Repeat at">
          <InputTime
            onChange={(e) => onChange("repeat_hour", moment(e, ["h:mm A"]).format("HH:mm"))}
            value={repeat_hour}
            timeFormat="12"
          />
        </FormGroup>
      </Style.Field>

      {showWeekDays && (
        <Style.Field width="300px">
          <FormGroup icon={EIcon["calendar-alt"]} label="Repeat on">
            <FlexRow>
              {renderWeekdayButton("Sunday")}
              {renderWeekdayButton("Monday")}
              {renderWeekdayButton("Tuesday")}
              {renderWeekdayButton("Wednesday")}
              {renderWeekdayButton("Thursday")}
              {renderWeekdayButton("Friday")}
              {renderWeekdayButton("Saturday")}
            </FlexRow>
          </FormGroup>
        </Style.Field>
      )}
    </div>
  );
}

export default BasicCron;
