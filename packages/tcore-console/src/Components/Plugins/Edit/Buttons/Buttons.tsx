import { IPlugin } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import { Link } from "../../../..";
import Button from "../../../Button/Button";
import { EButton } from "../../../Button/Button.types";
import Icon from "../../../Icon/Icon";
// import Tooltip from "../../../Tooltip/Tooltip";
import { EIcon } from "../../../Icon/Icon.types";
import ModalUninstallPlugin from "../../Common/ModalUninstallPlugin/ModalUninstallPlugin";
import * as Style from "./Buttons.style";

/**
 * Props.
 */
interface IButtonsProps {
  /**
   */
  data: IPlugin;
  /**
   * Called when the user confirm the uninstall.
   */
  onUninstall: (keepData: boolean) => Promise<void>;
  /**
   */
  onEnable: () => Promise<void>;
  /**
   */
  onDisable: () => Promise<void>;
}

/**
 */
function Buttons(props: IButtonsProps) {
  const [modalUninstall, setModalUninstall] = useState(false);
  const { onEnable, data, onDisable, onUninstall } = props;

  /**
   * Opens the uninstall modal.
   */
  const activateModalUninstall = useCallback(() => {
    setModalUninstall(true);
  }, []);

  /**
   * Closes the uninstall modal.
   */
  const deactivateModalUninstall = useCallback(() => {
    setModalUninstall(false);
  }, []);

  /**
   */
  const enable = useCallback(() => {
    onEnable();
  }, [onEnable]);

  /**
   */
  const disable = useCallback(() => {
    onDisable();
  }, [onDisable]);

  return (
    <Style.Container>
      <Link href={`/console/logs?channel=plugin:${data.id}&type=all`}>
        <Button addIconMargin onClick={activateModalUninstall}>
          <Icon icon={EIcon.scroll} />
          <span>View logs</span>
        </Button>
      </Link>

      {props.data.state === "disabled" ? (
        <Button onClick={enable} addIconMargin>
          <Icon icon={EIcon.check} />
          <span>Enable</span>
        </Button>
      ) : props.data.state === "stopping" || props.data.state === "starting" ? (
        <Button disabled addIconMargin>
          <span>Loading...</span>
        </Button>
      ) : (
        <Button onClick={disable} addIconMargin>
          <Icon icon={EIcon.ban} />
          <span>Disable</span>
        </Button>
      )}

      <Button addIconMargin type={EButton.danger_outline} onClick={activateModalUninstall}>
        <Icon icon={EIcon["trash-alt"]} />
        <span>Uninstall</span>
      </Button>

      {modalUninstall && (
        <ModalUninstallPlugin
          redirectTo="/"
          onClose={deactivateModalUninstall}
          onConfirm={onUninstall}
        />
      )}
    </Style.Container>
  );
}

export default Buttons;
