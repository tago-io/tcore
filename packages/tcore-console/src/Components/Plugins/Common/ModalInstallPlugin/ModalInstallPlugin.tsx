import { ESocketResource, ILog } from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { memo, MouseEvent, useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTheme } from "styled-components";
import installPlugin from "../../../../Requests/installPlugin";
import { socket } from "../../../../System/Socket";
import store from "../../../../System/Store";
import Console from "../../../Console/Console";
import { EIcon } from "../../../Icon/Icon.types";
import Modal from "../../../Modal/Modal";
import * as Style from "./ModalInstallPlugin.style";

/**
 * Props.
 */
interface IModalInstallPlugin {
  /**
   * Called when the modal is closed.
   */
  onClose: () => void;
  /**
   * The file path for the plugin that will be installed.
   */
  source: string;
}

/**
 * Controls the whole logic of making the request to install a plugin.
 * It also shows a progress bar and some output for the user to see how long the process may take.
 * This modal only install plugins in the filesystem, not files that can be downloaded.
 */
function ModalInstallPlugin(props: IModalInstallPlugin) {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const { source } = props;

  /**
   * Sends the install request to the back-end.
   */
  const sendInstallRequest = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await installPlugin(source);
      setProgress(100); // just to make sure it shows the bar complete
    } catch (e) {
      setError(true);
    } finally {
      setTimeout(() => {
        setDone(true);
      }, 500);
    }
  }, [source]);

  /**
   * Confirms and closes the modal.
   */
  const confirm = async (e: MouseEvent) => {
    setButtonDisabled(true);
    e.preventDefault();
    window.location.reload();
  };

  /**
   * Makes the request to install the plugin.
   */
  useEffect(() => {
    if (done) {
      return;
    }

    function onInstallLogs(data: any) {
      const log: ILog = {
        message: data.message,
        error: data.error,
        timestamp: Date.now() as any,
      };

      unstable_batchedUpdates(() => {
        if (data.error) {
          setError(true);
        }
        setProgress(data.progress);
        setLogs((l) => [...l, log]);
      });
    }

    socket.on("plugin::install", onInstallLogs);
    return () => {
      socket.off("plugin::install", onInstallLogs);
    };
  }, [done]);

  /**
   * Attaches and detaches the plugin to get the logs during installation.
   */
  useEffect(() => {
    if (store.socketConnected) {
      socket.emit("attach", ESocketResource.pluginInstall);
      return () => {
        socket.emit("detach", ESocketResource.pluginInstall);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected]);

  /**
   * Makes the request to install the plugin.
   */
  useEffect(() => {
    sendInstallRequest();
  }, [sendInstallRequest]);

  return (
    <Modal
      color={theme.buttonPrimary}
      icon={EIcon["puzzle-piece"]}
      onClose={() => window.location.reload()}
      onConfirm={confirm}
      confirmButtonText="Close"
      title="Installing Plugin"
      width="850px"
      height="90%"
      showCancelButton={false}
      showCloseButton={false}
      isConfirmButtonDisabled={buttonDisabled || !done}
    >
      <Style.Container>
        <Style.Message>Plugin source: {source}</Style.Message>

        <Style.Progress done={done} error={error} value={progress}>
          <div className="value">
            <div className="effect" />
          </div>
        </Style.Progress>

        <div className="console-container">
          <Console data={logs} />
        </div>
      </Style.Container>
    </Modal>
  );
}

export default memo(observer(ModalInstallPlugin));
