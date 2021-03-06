import { IDevice } from "@tago-io/tcore-sdk/types";
import Col from "../../../Col/Col";
import FormDivision from "../../../FormDivision/FormDivision";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Row from "../../../Row/Row";
import DataRetention from "../../Common/DataRetention/DataRetention";
import ResourceLinkField from "../../../ResourceLinkField/ResourceLinkField";

/**
 * Props.
 */
interface IGeneralInformationTabProps {
  /**
   * Bucket form data.
   */
  data: IDevice;
  /**
   * Bucket's form errors.
   */
  errors: any;
  /**
   * Retention information.
   */
  retention: any;
  /**
   * Called when a data retention field changes.
   */
  onChangeRetention: (newRetention: any) => void;
}

/**
 * The bucket's general information tab.
 */
function GeneralInformationTab(props: IGeneralInformationTabProps) {
  const { data, onChangeRetention, retention } = props;

  return (
    <div>
      <FormDivision icon={EIcon.cog} title="General Information" />

      <Row>
        <Col size="6">
          <Row>
            <Col size="12">
              <FormGroup icon={EIcon.bucket} label="Name">
                <Input value={data.name} disabled />
              </FormGroup>
            </Col>

            <Col size="12">
              <FormGroup
                icon={EIcon.device}
                label="Device"
                tooltip="Device associated to this bucket"
              >
                <ResourceLinkField
                  type="device"
                  icon={EIcon.device}
                  name={data.name}
                  link={`/console/devices/${data.id}`}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>

        <Col size="6">
          <DataRetention
            disabled={data.type === "mutable"}
            retention={retention}
            onChangeRetention={onChangeRetention}
          />
        </Col>
      </Row>
    </div>
  );
}

export default GeneralInformationTab;
