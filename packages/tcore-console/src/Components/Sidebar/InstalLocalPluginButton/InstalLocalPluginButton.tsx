import { useCallback, useState } from "react";
import Button from "../../Button/Button";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import Tooltip from "../../Tooltip/Tooltip";
import ModalUploadPlugin from "../../Plugins/Common/ModalUploadPlugin/ModalUploadPlugin";
import selectPluginFile from "../../../Helpers/selectPluginFile";
import * as Style from "./InstalLocalPluginButton.style";

/**
 * This component handles the installation of a plugin.
 */
function InstallLocalPluginButton() {
  const [modalUpload, setModalUpload] = useState(false);
  const [modalInstall, setModalInstall] = useState(false);
  const [file, setFile] = useState<File>();
  const [filePath, setFilePath] = useState("");

  /**
   * Opens the file selector modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activateModalFile = useCallback(() => {
    selectPluginFile((f) => {
      setFile(f);
      setModalUpload(true);
    });
  }, []);

  /**
   * Closes the file selector modal.
   */
  const deactivateModalFile = useCallback(() => {
    setModalUpload(false);
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

      {modalUpload && (
        <ModalUploadPlugin
          file={file as File}
          onClose={deactivateModalFile}
          onUpload={activateModalInstall}
        />
      )}

      {modalInstall && (
        <ModalInstallPlugin
          pluginName={file?.name}
          source={filePath}
          onClose={deactivateModalInstall}
        />
      )}
    </>
  );
}

export default InstallLocalPluginButton;
