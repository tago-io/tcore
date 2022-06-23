import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Button, EButton, EIcon, Icon } from "../../..";
import store from "../../../System/Store";
import ModalFileSelect from "../../ModalFileSelect/ModalFileSelect";
import ModalDownloadFromURL from "../../Plugins/Common/ModalDownloadFromURL/ModalDownloadFromURL";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword";
import SetupForm from "../SetupForm/SetupForm";
import * as Style from "./StepDatabase.style";

/**
 */
function StepDatabase(props: any) {
  const { onBack, onNext } = props;
  const [action, setAction] = useState("");
  const [modalInstall, setModalInstall] = useState(false);
  const [modalURL, setModalURL] = useState(false);
  const [modalFile, setModalFile] = useState(false);
  const [source, setSource] = useState("");

  /**
   * Opens the file selector modal.
   */
  const activateModalFile = () => {
    setModalFile(true);
  };

  /**
   * Opens the URL download modal.
   */
  const activateModalURL = () => {
    setModalURL(true);
  };

  /**
   * Closes the URL download modal.
   */
  const deactivateModalURL = () => {
    setModalURL(false);
  };

  /**
   * Closes the file selector modal.
   */
  const deactivateModalFile = () => {
    setModalFile(false);
  };

  /**
   * Opens the install modal.
   */
  const activateModalInstall = (path: string) => {
    setModalFile(false);
    setModalURL(false);
    setSource(path);
    setModalInstall(true);
  };

  /**
   * Closes the install modal.
   */
  const deactivateModalInstall = (data: any) => {
    setModalInstall(false);
    if (data) {
      onNext(data);
    }
  };

  /**
   */
  const doAction = () => {
    switch (action) {
      case "local-file":
        activateModalFile();
        break;
      case "download-url":
        activateModalURL();
        break;
      default:
        break;
    }
    setAction("");
  };

  /**
   */
  useEffect(() => {
    if (action && store.masterPassword) {
      doAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, store.masterPassword]);

  return (
    <>
      <SetupForm
        title="Pick a Database Plugin"
        description="A Database plugin is used to store data from your devices"
        buttons={[{ label: "Back", onClick: onBack }]}
      >
        <Style.Content>
          <Icon icon={EIcon.database} size="50px" color="rgba(0, 0, 0, 0.2)" />

          <span className="to-continue">To continue, you must load a .tcore file</span>

          <div className="decision">
            <Button onClick={() => setAction("local-file")} type={EButton.primary}>
              Select local file
            </Button>
            <span>or</span>
            <Button onClick={() => setAction("download-url")} type={EButton.primary}>
              Download from URL
            </Button>
          </div>
        </Style.Content>
      </SetupForm>

      {modalFile && (
        <ModalFileSelect
          accept=".tcore"
          message="Select a .tcore plugin file."
          onClose={deactivateModalFile}
          onConfirm={activateModalInstall}
          placeholder="/usr/local/plugin.tcore"
          title="Select a plugin to be installed"
          useLocalFs
        />
      )}

      {modalURL && (
        <ModalDownloadFromURL onClose={deactivateModalURL} onConfirm={activateModalInstall} />
      )}

      {modalInstall && <ModalInstallPlugin source={source} onClose={deactivateModalInstall} />}

      {action && !store.masterPassword && <ModalMasterPassword onClose={() => setAction("")} />}
    </>
  );
}

export default observer(StepDatabase);
