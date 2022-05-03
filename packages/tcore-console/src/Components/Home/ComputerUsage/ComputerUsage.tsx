import { IComputerUsage } from "@tago-io/tcore-sdk/types";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import Loading from "../../Loading/Loading";
import * as Style from "./ComputerUsage.style";

/**
 * Props.
 */
interface IComputerUsageProps {
  /**
   * Values.
   */
  usages: IComputerUsage[] | null;
}

/**
 * This is the content of the `Computer Usage` card in the home page.
 */
function ComputerUsage(props: IComputerUsageProps) {
  const { usages } = props;
  if (!usages) {
    return <Loading />;
  }

  /**
   * Gets the icon.
   */
  const getIcon = (type: string) => {
    if (type === "memory") {
      return EIcon.memory;
    } else if (type === "cpu") {
      return EIcon.microchip;
    } else if (type === "disk") {
      return EIcon.hdd;
    } else if (type === "battery") {
      return EIcon["battery-full"];
    } else {
      return EIcon.cog;
    }
  };

  /**
   * Renders a single usage.
   */
  const renderUsage = (usage: IComputerUsage) => {
    const { title, total, type, detail, used, description } = usage;
    const percent = Math.floor((used / total) * 100);

    return (
      <Style.Item key={title}>
        <Icon size="40px" icon={getIcon(type)} />

        <div className="data">
          <h3>{title}</h3>

          <div className="bar-container">
            <Style.Bar value={percent || 0} />
            <span>{percent}%</span>
          </div>

          <span className="description">
            {detail}
            {detail && description ? " • " : ""}
            {description}
          </span>
        </div>
      </Style.Item>
    );
  };

  return (
    <Style.Container>
      {(usages || []).map(renderUsage)}
      <div className="space" />
    </Style.Container>
  );
}

export default ComputerUsage;
