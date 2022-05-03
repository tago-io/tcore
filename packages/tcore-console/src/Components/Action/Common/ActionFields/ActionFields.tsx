import { IActionOption } from "@tago-io/tcore-sdk/types";
import FlexRow from "../../../FlexRow/FlexRow";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Switch from "../../../Switch/Switch";
import ActionTypePicker from "../ActionTypePicker/ActionTypePicker";
import HttpHeaders from "../HttpHeaders/HttpHeaders";
import MultipleAnalysis from "../MultipleAnalysis/MultipleAnalysis";
import PluginConfigFields from "../../../Plugins/Common/PluginConfigFields/PluginConfigFields";

/**
 * Props.
 */
interface IActionFields {
  /**
   * Additional options provided by plugins.
   */
  options?: IActionOption[];
  option: any;
  onChangeOption: any;
  optionFields: any;
  onChangeOptionFields: any;
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
  errors?: any;
}

/**
 */
function ActionFields(props: IActionFields) {
  const {
    option,
    optionsPosition,
    onChangeOption,
    optionFields,
    onChangeOptionFields,
    errors,
    options,
  } = props;

  /**
   */
  const renderTagoIO = () => {
    return (
      <>
        <FormGroup
          tooltip="Insert the token of a Device located in your TagoIO Cloud account"
          icon={EIcon.device}
          label="Device Token"
        >
          <Input
            autoComplete="new-password"
            onChange={(e) => onChangeOptionFields({ ...optionFields, token: e.target.value })}
            placeholder="enter a device's token"
            type="password"
            value={optionFields?.token || ""}
          />
        </FormGroup>
      </>
    );
  };

  /**
   */
  const renderPost = () => {
    return (
      <>
        <FormGroup label="HTTP Post End-point">
          <Input
            onChange={(e) => onChangeOptionFields({ ...optionFields, url: e.target.value })}
            placeholder="enter the url address"
            value={optionFields?.url || ""}
          />
        </FormGroup>

        <FormGroup label="HTTP Headers">
          <HttpHeaders
            value={optionFields.headers || []}
            onChange={(headers) => {
              onChangeOptionFields({ ...optionFields, headers });
            }}
          />
        </FormGroup>

        <FormGroup
          label="Fallback Device Token"
          icon={EIcon.device}
          tooltip="Enable and configure the token for a device to receive the data in case TagoIO API's requests fail a certain amount of times."
        >
          <FlexRow>
            <div style={{ marginRight: "10px", flex: 1 }}>
              <Input
                value={optionFields.fallback_token ?? ""}
                onChange={(e) =>
                  onChangeOptionFields({ ...optionFields, fallback_token: e.target.value })
                }
                disabled={!optionFields.http_post_fallback_enabled}
                placeholder="Fallback device token"
              />
            </div>

            <div style={{ flex: "none" }}>
              <Switch
                value={optionFields.http_post_fallback_enabled || false}
                onChange={(e) =>
                  onChangeOptionFields({ ...optionFields, http_post_fallback_enabled: e })
                }
              >
                Enabled
              </Switch>
            </div>
          </FlexRow>
        </FormGroup>
      </>
    );
  };

  /**
   */
  const renderAnalysis = () => {
    return (
      <MultipleAnalysis
        data={optionFields.analyses || [{}]}
        onChange={(e) => onChangeOptionFields({ ...optionFields, analyses: e })}
        errors={errors?.analyses}
        optionsPosition={optionsPosition}
      />
    );
  };

  /**
   */
  const renderCustomOption = () => {
    return (
      <PluginConfigFields
        data={option.configs || []}
        values={optionFields}
        onChangeValues={onChangeOptionFields}
        errors={errors}
      />
    );
  };

  /**
   */
  const renderContent = () => {
    if (option?.id === "script") {
      return renderAnalysis();
    } else if (option?.id === "post") {
      return renderPost();
    } else if (option?.id === "tagoio") {
      return renderTagoIO();
    } else if (option?.id) {
      return renderCustomOption();
    }
    return null;
  };

  return (
    <>
      <FormGroup
        icon={EIcon.bolt}
        tooltip="This is what will happen once your action is triggered."
        label="Type"
      >
        <ActionTypePicker
          onChange={onChangeOption}
          options={options}
          optionsPosition={optionsPosition}
          value={option}
        />
      </FormGroup>

      <div style={{ padding: "0px 35px" }}>{renderContent()}</div>
    </>
  );
}

export default ActionFields;
