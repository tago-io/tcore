import { TPluginState } from "@tago-io/tcore-sdk/types";
import Capitalize from "../../../Capitalize/Capitalize";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import Publisher from "../Publisher/Publisher";
import * as Style from "./MainInformation.style";

/**
 * Props.
 */
interface IMainInformationProps {
  /**
   * Name of the publisher.
   */
  publisherName: string;
  /**
   * Domain in case the publisher is verified.
   */
  publisherDomain?: string;
  /**
   * Version of the plugin.
   */
  version: string;
  /**
   * Date of install for the plugin.
   */
  installDate?: string;
  /**
   * Date of publish for the plugin.
   */
  publishDate?: string;
  /**
   * State of execution of the plugin.
   */
  state?: TPluginState;
}

/**
 * Renders the main information of a plugin in a tabular way.
 * Some of the information shown here: `publisher`, `version`, `install date`.
 */
function MainInformation(props: IMainInformationProps) {
  const { version, state, publisherName, publisherDomain, publishDate } = props;

  return (
    <Style.Container>
      <div className="item">
        <div>Version</div>
        <div>{version}</div>
      </div>

      <div className="item">
        <div>Publisher</div>
        <Publisher clickable domain={publisherDomain} name={publisherName} />
      </div>

      {state && (
        <div className="item">
          <div>State</div>
          <Capitalize>{state}</Capitalize>
        </div>
      )}

      {publishDate && (
        <div className="item">
          <div>Publish Date</div>
          <RelativeDate value={publishDate} />
        </div>
      )}
    </Style.Container>
  );
}

export default MainInformation;
