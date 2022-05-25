import { EIcon } from "../../../../..";
import EmptyMessage from "../../../../EmptyMessage/EmptyMessage";
import * as Style from "./MessageTriggerNotFound.style";

interface IMessageTriggerNotFound {
  type: string;
}

/**
 * This is a message component showing the text "trigger not found".
 * Used to show the user that the trigger can't be used/found.
 */
function MessageTriggerNotFound(props: IMessageTriggerNotFound) {
  const { type } = props;
  const moduleName = type.split(":")[1];
  return (
    <Style.Container>
      <EmptyMessage
        icon={EIcon.times}
        message={
          <>
            <span>
              Trigger <b>{moduleName}</b> was not found.
            </span>
            <br />
            <span>Check if you have the plugin installed and the module is started.</span>
          </>
        }
      />
    </Style.Container>
  );
}

export default MessageTriggerNotFound;
