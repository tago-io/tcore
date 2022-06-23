import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import { useEffect, MouseEvent, useCallback, useState } from "react";
import { setLocalStorage } from "../../../../Helpers/localStorage";
import store from "../../../../System/Store";
import FormGroup from "../../../FormGroup/FormGroup";
import Modal from "../../../Modal/Modal";
import * as Style from "./ModalFactoryReset.style";

/**
 * Props.
 */
interface IModalFactoryResetProps {
  onClose: () => void;
}

/**
 */
function ModalFactoryReset(props: IModalFactoryResetProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(5);

  const { onClose } = props;

  /**
   * Makes the call to reset to factory.
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      if (timer) {
        return;
      }

      e?.preventDefault();
      setButtonDisabled(true);

      const masterPassword = store.masterPassword;
      await axios.post("/settings/reset", null, { headers: { masterPassword } });

      setLocalStorage("token", "");

      window.location.reload();
    },
    [timer]
  );

  /**
   * Lowers the timer.
   */
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    }
  }, [timer]);

  return (
    <Modal
      confirmButtonText={timer ? `Please wait (${timer}s)` : "Yes, perform a factory reset"}
      isCancelButtonDisabled={buttonDisabled}
      isConfirmButtonDisabled={buttonDisabled || timer > 0}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={confirm}
      title="Factory reset"
      width="600px"
    >
      <FormGroup>
        A Factory reset will remove all <b>settings</b>, <b>plugins</b>, and <b>plugin files</b>{" "}
        from your {getSystemName()}.
      </FormGroup>

      <FormGroup>Here is a summary of what will happen if you proceed:</FormGroup>

      <FormGroup addMarginBottom={false}>
        <Style.Point>
          All Plugins in the default <b>Plugins folder</b> will be deleted
        </Style.Point>
        <Style.Point>
          All {getSystemName()} settings will be restored to their default values
        </Style.Point>
        <Style.Point>You will need to set a new master password</Style.Point>
        <Style.Point>You will need to reinstall a database plugin</Style.Point>
        <Style.Point>
          Database data will <b>NOT</b> be deleted
        </Style.Point>
      </FormGroup>
    </Modal>
  );
}

export default ModalFactoryReset;
