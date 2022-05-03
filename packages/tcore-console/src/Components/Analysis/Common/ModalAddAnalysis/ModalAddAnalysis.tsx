import { zName } from "@tago-io/tcore-sdk/types";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTheme } from "styled-components";
import createAnalysis from "../../../../Requests/createAnalysis";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Modal from "../../../Modal/Modal";

/**
 */
interface IModalAddAnalysis {
  onClose: () => void;
}

/**
 * The modal to create a new analysis.
 */
function ModalAddAnalysis(props: IModalAddAnalysis) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [newID, setNewID] = useState("");
  const [errors, setErrors] = useState<any>({});
  const history = useHistory();
  const { onClose } = props;

  /**
   * Validates the data of the analysis.
   */
  const validate = useCallback(async () => {
    const err: any = {
      name: await zName
        .parseAsync(name)
        .then(() => false)
        .catch(() => true),
    };
    if (err.name) {
      setErrors(err);
      return false;
    }

    return true;
  }, [name]);

  /**
   * Creates the analysis.
   */
  const doRequest = useCallback(async () => {
    const data = {
      name: name,
      active: true,
      tags: [],
    };

    const response = await createAnalysis(data);

    setNewID(response);
  }, [name]);

  /**
   * Called when the confirm button is pressed.
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      if (await validate()) {
        await doRequest();
      }
      e?.preventDefault();
    },
    [doRequest, validate]
  );

  /**
   * Used to transfer the user to the newly created analysis.
   */
  useEffect(() => {
    if (newID) {
      history.push(`/console/analysis/${newID}`);
    }
  }, [history, newID]);

  return (
    <Modal
      color={theme.analysis}
      icon={EIcon.code}
      onClose={onClose}
      onConfirm={confirm}
      title="Add Analysis"
      width="450px"
    >
      <FormGroup addMarginBottom={false} label="Name" icon={EIcon.code}>
        <Input
          autoFocus
          error={errors?.name}
          errorMessage="This field requires at least 3 characters"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name that describes the purpose of your code"
          value={name}
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalAddAnalysis;
