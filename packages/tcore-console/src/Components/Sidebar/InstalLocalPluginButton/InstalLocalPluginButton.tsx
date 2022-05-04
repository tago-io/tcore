import { useCallback, useState } from "react";
import ModalFileSelect from "../../ModalFileSelect/ModalFileSelect";
import Button from "../../Button/Button";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import Tooltip from "../../Tooltip/Tooltip";
import * as Style from "./InstalLocalPluginButton.style";

/**
 * This component handles the installation of a plugin.
 */
function InstallLocalPluginButton() {
  const [modalFile, setModalFile] = useState(false);
  const [modalInstall, setModalInstall] = useState(false);
  const [filePath, setFilePath] = useState("");

  /**
   * Opens the file selector modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activateModalFile = useCallback(() => {
    setModalFile(true);
  }, []);

  /**
   * Closes the file selector modal.
   */
  const deactivateModalFile = useCallback(() => {
    setModalFile(false);
  }, []);

  /**
   * Opens the install modal.
   */
  const activateModalInstall = useCallback((path: string) => {
    setFilePath(path);
    setModalInstall(true);
  }, []);

  /**
   * Closes the install modal.
   */
  const deactivateModalInstall = useCallback(() => {
    setModalInstall(false);
  }, []);

  return (
    <>
      <Style.Container>
        <Tooltip text="Install local plugin">
          <Button onClick={activateModalFile}>
            <Icon icon={EIcon["puzzle-piece"]} size="15px" />
          </Button>
        </Tooltip>
      </Style.Container>

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

      {modalInstall && <ModalInstallPlugin source={filePath} onClose={deactivateModalInstall} />}
    </>
  );
}

export default InstallLocalPluginButton;
