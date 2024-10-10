import { useCallback, useMemo, useState } from "react";
import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import type { ISettings } from "@tago-io/tcore-sdk/types";
import Button from "../../Button/Button";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import Tooltip from "../../Tooltip/Tooltip";
import ModalUploadPlugin from "../../Plugins/Common/ModalUploadPlugin/ModalUploadPlugin";
import FileSelect from "../../FileSelect/FileSelect";
import useApiRequest from "../../../Helpers/useApiRequest";
import store from "../../../System/Store";
import { getLocalStorage } from "../../../Helpers/localStorage";
import * as Style from "./InstalLocalPluginButton.style";
/**
 * This component handles the installation of a plugin.
 */
function InstallLocalPluginButton() {
  const [modalUpload, setModalUpload] = useState(false);
  const [modalInstall, setModalInstall] = useState(false);
  const [file, setFile] = useState<File>();
  const [filePath, setFilePath] = useState("");
  const [modalSelectFolder, setModalSelectFolder] = useState(false);
  const { data: settings } = useApiRequest<ISettings>("/mainsettings");
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = useMemo(() => ({ token, masterPassword }), [token, masterPassword]);

  /**
   * Opens the file selector modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activateModalFile = useCallback(() => {
    setModalSelectFolder(true);
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
    window.location.reload();
  }, []);

  /**
   * Add plugin folder to the property custom_plugins.
   */
  const addFolder = useCallback(() => {
    axios.put("/settings", { settings }, { headers });
  }, [headers, settings]);

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

      {modalSelectFolder && (
        <FileSelect
          error={false}
          modalMessage={`Select a folder of your plugin of ${getSystemName()}.`}
          onChange={addFolder}
          onlyFolders={true}
          placeholder="e.g. /users/tcore-plugins"
          value={settings?.settings_folder || ""}
          disabled={false}
          useLocalFs
        />
      )}
    </>
  );
}

export default InstallLocalPluginButton;
