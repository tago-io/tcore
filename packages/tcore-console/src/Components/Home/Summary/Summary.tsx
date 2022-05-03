import { ISummary } from "@tago-io/tcore-sdk/types";
import { memo } from "react";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import * as Style from "./Summary.style";

/**
 * Props.
 */
interface ISummaryProps {
  /**
   * Data to be rendered.
   */
  data?: ISummary | null;
}

/**
 * Summary component for the home page.
 */
function Summary(props: ISummaryProps) {
  const { data } = props;
  const loading = !data;

  /**
   * Renders a single item in the list.
   */
  const renderItem = (icon: EIcon, name: string, value?: number | string) => {
    let realValue = value;
    if (loading || value === undefined || value === null) {
      realValue = "-";
    }

    return (
      <Style.Item>
        <div className="left">
          <Icon size="12px" icon={icon} />
          <span>{name}</span>
        </div>
        <div className="value">{realValue}</div>
      </Style.Item>
    );
  };

  return (
    <Style.Container $loading={loading}>
      <div className="group">
        {renderItem(EIcon.device, "Devices", data?.device)}
        {renderItem(EIcon.bucket, "Buckets", data?.device)}
      </div>
      <div className="group">
        {renderItem(EIcon.code, "Analysis", data?.analysis)}
        {renderItem(EIcon.bolt, "Actions", data?.action)}
      </div>
      <div className="group">
        {renderItem(EIcon.connector, "Connectors", "-")}
        {renderItem(EIcon.tcore, "Version", "0.3.3")}
      </div>
    </Style.Container>
  );
}

export default memo(Summary);
