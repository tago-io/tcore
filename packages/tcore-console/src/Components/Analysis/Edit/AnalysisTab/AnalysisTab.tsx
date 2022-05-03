import { IAnalysis, ILog } from "@tago-io/tcore-sdk/types";
import { memo, useCallback } from "react";
import downloadFile from "../../../../Helpers/download";
import getDateTimeObject from "../../../../Helpers/getDateTimeObject";
import Button from "../../../Button/Button";
import { EButton } from "../../../Button/Button.types";
import Console from "../../../Console/Console";
import FlexRow from "../../../FlexRow/FlexRow";
import FormGroup from "../../../FormGroup/FormGroup";
import Icon from "../../../Icon/Icon";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input";
import ProgramFieldset from "../../../ProgramFieldset/ProgramFieldset";
import AutomateTip from "../../Common/AutomateTip/AutomateTip";
import * as Style from "./AnalysisTab.style";

/**
 * Props.
 */
interface IAnalysisTabProps {
  /**
   * Analysis' form data
   */
  data: IAnalysis;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IAnalysis, value: IAnalysis[keyof IAnalysis]) => void;
  /**
   * Output logs for the analysis.
   */
  logs: ILog[];
  /**
   * Called when the logs are cleared.
   */
  onClearLogs: () => void;
}

/**
 * The device edit page.
 */
function AnalysisTab(props: IAnalysisTabProps) {
  const { data, logs, onClearLogs, onChange } = props;

  /**
   * Downloads the logs in a `txt` file.
   */
  const downloadLogs = useCallback(() => {
    const mapped = logs.map((item) => {
      const date = getDateTimeObject(item.timestamp)?.toFormat("yyyy-LL-dd HH:mm:ss.SSS");
      const message = String(item.message).trim();
      return `[${date}]: ${message}`;
    });
    downloadFile(mapped.join("\n"), "txt", "console");
  }, [logs]);

  /**
   * Renders the console header.
   */
  const renderConsoleHeader = () => {
    return (
      <Style.ConsoleHeader>
        <div>
          <h2>Console</h2>
        </div>

        <FlexRow>
          <Button type={EButton.icon} onClick={downloadLogs}>
            <Icon size="15px" icon={EIcon.download} />
          </Button>

          <Button type={EButton.icon} onClick={onClearLogs}>
            <Icon size="15px" icon={EIcon.ban} />
          </Button>
        </FlexRow>
      </Style.ConsoleHeader>
    );
  };

  return (
    <Style.Container>
      <div className="data">
        <FormGroup icon={EIcon.code} label="Name">
          <Input
            onChange={(e) => onChange("name", e.target.value)}
            value={data.name}
            placeholder="Enter the analysis' name"
          />
        </FormGroup>

        <FormGroup>
          <AutomateTip />
        </FormGroup>

        <ProgramFieldset
          binaryPath={data.binary_path || ""}
          filePath={data.file_path || ""}
          onChangeBinaryPath={(e) => onChange("binary_path", e)}
          onChangeFilePath={(e) => onChange("file_path", e)}
          title="Code"
        />
      </div>

      <div className="console">
        {renderConsoleHeader()}
        <Console showDate data={logs} emptyMessage="No logs yet." emptyMessageIcon={EIcon.code} />
      </div>
    </Style.Container>
  );
}

export default memo(AnalysisTab);
