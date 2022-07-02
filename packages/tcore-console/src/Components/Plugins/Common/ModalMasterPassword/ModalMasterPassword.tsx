import axios from "axios";
import { KeyboardEvent, MouseEvent, useCallback, useState } from "react";
import { EIcon } from "../../../..";
import { promiseDelay } from "../../../../Helpers/promiseDelay";
import store from "../../../../System/Store";
import FormGroup from "../../../FormGroup/FormGroup";
import Input from "../../../Input/Input";
import Modal from "../../../Modal/Modal";

/**
 * Props.
 */
interface IModalMasterPasswordProps {
  onClose?: () => void;
  onConfirm?: () => void;
}

/**
 */
function ModalMasterPassword(props: IModalMasterPasswordProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { onConfirm, onClose } = props;

  /**
   * Checks to see if the master password matches.
   */
  const check = useCallback(
    async (e?: MouseEvent) => {
      e?.preventDefault();
      setError(false);
      setLoading(true);

      const headers = { masterPassword: value };
      axios
        .post("/check-master-password", null, { headers })
        .then(async () => {
          // small delay generates more 'trust'
          await promiseDelay(200);
          store.masterPassword = value;
          onConfirm?.();
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    },
    [value, onConfirm]
  );

  /**
   * Called when the input receives a keydown event.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && value) {
        check();
      }
    },
    [check, value]
  );

  return (
    <Modal
      confirmButtonText="Continue"
      isConfirmButtonDisabled={loading}
      isCancelButtonDisabled={loading}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={check}
      title="Master password required"
      width="550px"
    >
      <FormGroup>
        In order to perform this action, we need to verify if this is really you. Please enter your
        master password in the field below.
      </FormGroup>

      <FormGroup addMarginBottom={false} label="Master Password" icon={EIcon.key}>
        <Input
          autoFocus
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter your master password"
          value={value}
          error={error}
          errorMessage="Invalid Master Password"
          type="password"
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalMasterPassword;
