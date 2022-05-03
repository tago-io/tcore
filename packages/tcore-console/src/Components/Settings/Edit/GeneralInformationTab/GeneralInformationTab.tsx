import { ISettings, ISettingsMetadata } from "@tago-io/tcore-sdk/types";
import useApiRequest from "../../../../Helpers/useApiRequest";
import Col from "../../../Col/Col";
import FileSelect from "../../../FileSelect/FileSelect";
import FormDivision from "../../../FormDivision/FormDivision";
import FormGroup from "../../../FormGroup/FormGroup";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import Row from "../../../Row/Row";
import Select, { ISelectOption } from "../../../Select/Select";

/**
 * Props.
 */
interface IGeneralInformationTabProps {
  /**
   * Settings' form data.
   */
  data: ISettings;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof ISettings, value: ISettings[keyof ISettings]) => void;
  /**
   * Settings's form errors.
   */
  errors: any;
  /**
   */
  metadata?: ISettingsMetadata;
}

/**
 * The settings' `General Information` tab.
 */
function GeneralInformationTab(props: IGeneralInformationTabProps) {
  const { data: databaseList } = useApiRequest<any[]>("/module?type=database");
  const { data: filesystemList } = useApiRequest<any[]>("/module?type=filesystem");
  const { data, metadata, errors } = props;

  /**
   * Gets a list of database options based on the backend list.
   */
  const getDatabaseOptions = () => {
    const options: ISelectOption[] = [{ label: "Default (first one loaded)", value: "" }];
    for (const item of databaseList || []) {
      options.push({ label: item.setupName, value: `${item.pluginID}:${item.setupID}` });
    }
    return options;
  };

  /**
   * Gets a list of filesystem options based on the backend list.
   */
  const getFilesystemOptions = () => {
    const options: ISelectOption[] = [{ label: "Local Disk", value: "" }];
    for (const item of filesystemList || []) {
      options.push({ label: item.setupName, value: `${item.pluginID}:${item.setupID}` });
    }
    return options;
  };

  return (
    <div>
      <Row>
        <Col size="6">
          <FormDivision icon={EIcon.cog} title="General Information" />

          <FormGroup
            tooltip="The location in the server's filesystem where the settings will reside."
            icon={EIcon.folder}
            label="Settings folder"
          >
            <Input disabled readOnly value={data.settings_folder || ""} />
          </FormGroup>

          <FormGroup
            tooltip="The port that the application will run. By default it is 8888."
            icon={EIcon["pencil-alt"]}
            label="Port"
          >
            <Input
              error={errors?.port}
              onChange={(e) => props.onChange("port", e.target.value)}
              placeholder="8888"
              type="number"
              disabled={metadata?.port_disabled}
              value={data.port || ""}
            />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormDivision icon={EIcon["puzzle-piece"]} title="Plugin Settings" />

          <FormGroup
            tooltip="The location in the server's filesystem where the plugin folder will reside."
            icon={EIcon.folder}
            label="Plugins folder"
          >
            <FileSelect
              error={errors?.plugin_folder}
              modalMessage="Select a folder to be used as the plugins folder of TCore."
              onChange={(e) => props.onChange("plugin_folder", e)}
              onlyFolders
              placeholder="e.g. /users/tcore-plugins"
              value={data.plugin_folder}
              disabled={metadata?.plugin_folder_disabled}
              useLocalFs
            />
          </FormGroup>

          <FormGroup
            tooltip="The plugin that will be used as the main database for TCore."
            icon={EIcon.database}
            label="Database plugin"
          >
            <Select
              onChange={(e) => props.onChange("database_plugin", e.target.value)}
              placeholder="Select the default database plugin"
              value={data.database_plugin}
              error={errors?.database_plugin}
              errorMessage="This field is required"
              options={getDatabaseOptions()}
              disabled={metadata?.database_plugin_disabled}
            />
          </FormGroup>

          <FormGroup
            tooltip="The plugin that will be used as the main filesystem for TCore."
            icon={EIcon.folder}
            label="Filesystem plugin"
          >
            <Select
              onChange={(e) => props.onChange("filesystem_plugin", e.target.value)}
              placeholder="Select the default filesystem plugin"
              value={data.filesystem_plugin}
              error={errors?.filesystem_plugin}
              errorMessage="This field is required"
              options={getFilesystemOptions()}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default GeneralInformationTab;
