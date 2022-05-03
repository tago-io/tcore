import { IActionOption, zName } from "@tago-io/tcore-sdk/types";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTheme } from "styled-components";
import useApiRequest from "../../../../Helpers/useApiRequest";
import createAction from "../../../../Requests/createAction/createAction";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Modal from "../../../Modal/Modal";
import normalizeOption from "../../Helpers/normalizeType";
import ActionFields from "../ActionFields/ActionFields";
import TypeRadio from "../TypeRadio/TypeRadio";

/**
 */
interface IModalAddAction {
  onClose: () => void;
}

/**
 * The modal to create a new action.
 */
function ModalAddAction(props: IModalAddAction) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [type, setType] = useState("variable");
  const [newID, setNewID] = useState("");
  const [option, setOption] = useState<IActionOption | null>(null);
  const [optionFields, setOptionFields] = useState({});
  const [errors, setErrors] = useState<any>({});
  const { data: additionalTriggers } = useApiRequest<IActionOption[]>("/action-types");
  const history = useHistory();
  const { onClose } = props;

  /**
   * Validates the data of the action.
   */
  const validate = useCallback(async () => {
    const err: any = {
      // option: !option,
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
   * Creates the action.
   */
  const doRequest = useCallback(async () => {
    const data = {
      action: { type: option?.id, ...normalizeOption(option, optionFields) },
      name: name,
      type,
      active: true,
      tags: [],
    };

    const response = await createAction(data);

    setNewID(response);
  }, [type, option, optionFields, name]);

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
   * Used to transfer the user to the newly created action.
   */
  useEffect(() => {
    if (newID) {
      history.push(`/console/actions/${newID}`);
    }
  }, [history, newID]);

  return (
    <Modal
      color={theme.action}
      icon={EIcon.bolt}
      onClose={onClose}
      onConfirm={confirm}
      title="Add Action"
      width="650px"
    >
      <FormGroup label="Name" icon={EIcon.bolt}>
        <Input
          autoFocus
          error={errors?.name}
          errorMessage="This field requires at least 3 characters"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for this action"
          value={name}
        />
      </FormGroup>

      <FormGroup>
        <TypeRadio value={type} onChange={setType} />
      </FormGroup>

      <FormGroup addMarginBottom={false}>
        <ActionFields
          onChangeOption={setOption}
          onChangeOptionFields={setOptionFields}
          option={option}
          optionFields={optionFields}
          options={additionalTriggers}
          optionsPosition="top"
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalAddAction;
