import { useCallback, useEffect, useRef } from "react";
import retentionGIF from "../../../../../assets/images/retention.gif";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Select from "../../../Select/Select";
import * as Style from "./DataRetention.style";

/**
 * Props.
 */
interface IDataRetention {
  /**
   * Retention data.
   */
  retention: any;
  /**
   * Called when a retention field changes.
   */
  onChangeRetention: (newRetention: any) => void;
  /**
   */
  error?: boolean;
  disabled?: boolean;
}

/**
 * Controls the data retention property of a device.
 * This component shows some inputs to define the retention of the device and a visual
 * representation below the inputs.
 */
function DataRetention(props: IDataRetention) {
  const { retention, error, onChangeRetention } = props;
  const isForever = retention.unit === "forever";
  const input = useRef<HTMLInputElement>(null);

  /**
   * Renders the banner of the component.
   */
  const renderBanner = () => {
    const pluralDisplay = `${retention.value || 0} ${retention.unit}${
      retention.value === "1" ? "" : "s"
    }`;

    return (
      <>
        {retention.unit === "forever" ? (
          // forever retention
          <Style.Banner key="banner">
            <span className="title">Data retention strategy:</span>
            <span className="sub-title">The data in the bucket will be kept forever.</span>
          </Style.Banner>
        ) : (
          // custom retention
          <Style.Banner key="banner">
            <span className="title">Data retention strategy:</span>
            <span className="sub-title">
              All data older than {pluralDisplay} will be deleted from the bucket.
            </span>
            <img src={retentionGIF} alt="data-retention" />
          </Style.Banner>
        )}
      </>
    );
  };

  /**
   * Called when the select changes values.
   */
  const onChangeUnit = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!retention.value) {
        retention.value = "1";
      }
      onChangeRetention({ ...retention, unit: e.target.value });
    },
    [retention, onChangeRetention]
  );

  /**
   * This effect is used to focus the input after changing the unit.
   */
  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [retention?.unit]);

  return (
    <Style.Container isForever={isForever} disabled={!!props.disabled}>
      <FormGroup
        addMarginBottom={false}
        icon={EIcon.clock}
        label="Retain data in the bucket for"
        tooltip="After this period expires, old data will be removed from your bucket."
      >
        <div className="form-group-content">
          {isForever ? null : (
            <Input
              min="0"
              onChange={(e) => onChangeRetention({ ...retention, value: e.target.value })}
              ref={input}
              type="number"
              value={retention.value || ""}
              error={error}
            />
          )}

          <Select
            onChange={onChangeUnit}
            value={retention.unit || "day"}
            error={error}
            options={[
              {
                label: `Day${Number(retention.value) === 1 ? "" : "s"}`,
                value: "day",
              },
              {
                label: `Week${Number(retention.value) === 1 ? "" : "s"}`,
                value: "week",
              },
              {
                label: `Month${Number(retention.value) === 1 ? "" : "s"}`,
                value: "month",
              },
              {
                label: `Quarter${Number(retention.value) === 1 ? "" : "s"}`,
                value: "quarter",
              },
              {
                label: `Year${Number(retention.value) === 1 ? "" : "s"}`,
                value: "year",
              },
              { label: `Forever`, value: "forever" },
            ]}
          />
        </div>
      </FormGroup>

      {renderBanner()}
    </Style.Container>
  );
}

export default DataRetention;
