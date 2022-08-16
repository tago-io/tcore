import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { PLUGIN_STORE_PLUGIN_ID } from "@tago-io/tcore-shared";
import { EIcon, EmptyMessage, Loading, useApiRequest } from "../../..";
import store from "../../../System/Store";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword";
import SetupForm from "../SetupForm/SetupForm";
import StepDatabaseNoStore from "../StepDatabaseNoStore/StepDatabaseNoStore";
import StepDatabaseWithStore from "../StepDatabaseWithStore/StepDatabaseWithStore";

/**
 * Wrapper of the database step to figure out which screen to show:
 *
 * - the database selection without the plugin store.
 * - or the database selection with the plugin store.
 */
function StepDatabaseWrapper(props: any) {
  const [checkPassword, setCheckPassword] = useState(true);
  const { data, error } = useApiRequest(
    `/plugin/${PLUGIN_STORE_PLUGIN_ID}/get-database-list/call`,
    {
      method: "post",
      skip: !store.masterPassword,
    }
  );
  const { onBack, onNext } = props;

  /**
   */
  useEffect(() => {
    if (store.masterPassword) {
      setCheckPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.masterPassword]);

  const loading = !data && !error;

  return (
    <>
      {loading || !store.masterPassword ? (
        <SetupForm
          title="Pick a Database Plugin"
          description="A Database plugin is used to store data from your devices"
        >
          {!checkPassword && !store.masterPassword ? (
            <EmptyMessage icon={EIcon.lock} message="Invalid master password" />
          ) : (
            <Loading />
          )}
        </SetupForm>
      ) : error ? (
        <StepDatabaseNoStore onBack={onBack} onNext={onNext} />
      ) : (
        <StepDatabaseWithStore onBack={onBack} onNext={onNext} />
      )}

      {checkPassword && !store.masterPassword && (
        <ModalMasterPassword onClose={() => setCheckPassword(false)} />
      )}
    </>
  );
}

export default observer(StepDatabaseWrapper);
