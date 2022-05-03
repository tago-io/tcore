import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTheme } from "styled-components";
import { zName } from "@tago-io/tcore-sdk/types";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Modal from "../../../Modal/Modal";
import BucketTypePicker from "../DeviceTypePicker/DeviceTypePicker";
import createDevice from "../../../../Requests/createDevice";
import DataRetention from "../../../Bucket/Common/DataRetention/DataRetention";
import joinBucketDataRetention from "../../../Bucket/Helpers/joinDataRetention";

/**
 * Props.
 */
interface IModalAddDeviceProps {
  onClose: () => void;
}

/**
 * The device's wizard modal.
 */
function ModalAddDevice(props: IModalAddDeviceProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<any>("immutable");
  const [retention, setRetention] = useState({ value: "1", unit: "forever" });
  const [newID, setNewID] = useState("");
  const [errors, setErrors] = useState<any>({});
  const history = useHistory();
  const theme = useTheme();

  const { onClose } = props;

  /**
   * Validates the data of the device.
   */
  const validate = useCallback(async () => {
    const err: any = {
      name: !zName.safeParse(name).success,
      data_retention: retention.unit !== "forever" && (!retention.value || !retention.unit),
      type: !type?.id,
    };

    if (err.name || err.data_retention || err.type) {
      setErrors(err);
      return false;
    }

    return true;
  }, [name, type?.id, retention]);

  /**
   * Creates the device.
   */
  const doRequest = useCallback(async () => {
    const data = {
      name: name,
      data_retention: joinBucketDataRetention(retention),
      type: type?.id,
    };

    const response = await createDevice(data);

    setNewID(response.device_id);
  }, [name, type?.id, retention]);

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
   * Used to transfer the user to the newly created device.
   */
  useEffect(() => {
    if (newID) {
      history.push(`/console/devices/${newID}`);
    }
  }, [history, newID]);

  return (
    <Modal
      color={theme.device}
      icon={EIcon.device}
      onClose={onClose}
      onConfirm={confirm}
      title="Add Device"
      width="650px"
    >
      <FormGroup label="Name" icon={EIcon.device}>
        <Input
          autoFocus
          error={errors?.name}
          errorMessage="This field requires at least 3 characters"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for this device"
          value={name}
        />
      </FormGroup>

      <FormGroup label="Type" icon={EIcon.cog}>
        <BucketTypePicker onChange={setType} value={type} error={errors?.type} />
      </FormGroup>

      <DataRetention
        error={errors?.data_retention}
        retention={type?.id === "mutable" ? { value: "1", unit: "forever" } : retention}
        onChangeRetention={setRetention}
        disabled={type?.id === "mutable"}
      />
    </Modal>
  );
}

export default ModalAddDevice;
