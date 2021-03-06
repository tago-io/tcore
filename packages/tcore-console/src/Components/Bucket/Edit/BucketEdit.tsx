import { IDevice } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import { formatDataAmount } from "../../../Helpers/formatDataAmount";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName";
import useApiRequest from "../../../Helpers/useApiRequest";
import deleteDeviceData from "../../../Requests/deleteDeviceData";
import editDevice from "../../../Requests/editDevice";
import store from "../../../System/Store";
import buildZodError from "../../../Validation/buildZodError";
import EditPage from "../../EditPage/EditPage";
import { EIcon } from "../../Icon/Icon.types";
import joinBucketDataRetention from "../Helpers/joinDataRetention";
import separateDataRetention from "../Helpers/separateDataRetention";
import GeneralInformationTab from "./GeneralInformationTab/GeneralInformationTab";
import MoreTab from "./MoreTab/MoreTab";
import VariablesTab from "./VariablesTab/VariablesTab";

/**
 * The bucket's edit page.
 */
function BucketEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IDevice>({} as IDevice);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const { data: dataAmount, mutate: mutateDataAmount } = useApiRequest<number>(
    `/device/${id}/data_amount`
  );
  const [retention, setRetention] = useState<any>({ value: "1", unit: "day" });

  const initialRetention = useRef<any>();

  const loading = !data.id || dataAmount === undefined;

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((bucket: IDevice) => {
    setData(bucket);
    const ret = separateDataRetention(bucket);
    initialRetention.current = { ...ret };
    setRetention({ ...ret });
  }, []);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    try {
      setErrors({});
      return true;
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      if (err.tags) {
        setTabIndex(2);
      } else {
        setTabIndex(0);
      }
      setErrors(err);
      return false;
    }
  }, []);

  /**
   * Saves the bucket.
   */
  const save = useCallback(async () => {
    await editDevice(id, {
      data_retention: joinBucketDataRetention(retention),
    });
    initialRetention.current = { ...retention };
  }, [retention, id]);

  /**
   * Empties the bucket.
   */
  const emptyBucket = useCallback(async () => {
    await axios.post(`/device/${id}/empty`, {}, { headers: { token: store.token } });
    window.location.reload();
    await new Promise(() => {
      /* to get stuck until reload */
    });
  }, [id]);

  /**
   * Deletes certain data points.
   */
  const deleteData = useCallback(
    async (ids: string[]) => {
      await deleteDeviceData(id, { ids });
      mutateDataAmount(Math.max(dataAmount - ids.length, 0));
    },
    [mutateDataAmount, dataAmount, id]
  );

  /**
   * Renders the `Variables` tab's content.
   */
  const renderVariables = () => {
    return (
      <VariablesTab
        onReloadDataAmount={() => mutateDataAmount(dataAmount, true)}
        data={data}
        dataAmount={dataAmount}
        onDeleteData={deleteData}
      />
    );
  };

  /**
   * Renders the `General Information` tab's content.
   */
  const renderGeneralInformationTab = () => {
    return (
      <GeneralInformationTab
        data={data}
        errors={errors}
        onChangeRetention={setRetention}
        retention={retention}
      />
    );
  };

  /**
   * Renders the page's nav description.
   */
  const renderDescription = () => {
    return (
      <>
        <span>Data retention </span>
        <b>{data.data_retention || "Forever"}</b>
        <span> &nbsp;|&nbsp; </span>
        <span>Amount of data records </span>
        <b>{formatDataAmount(dataAmount)}</b>

        <span> &nbsp;|&nbsp; </span>
        <span>Type </span>
        <b>{getDeviceTypeName(data.type)}</b>
      </>
    );
  };

  /**
   * Renders the `More` tab.
   */
  const renderMoreTab = useCallback(() => {
    return <MoreTab onEmptyBucket={emptyBucket} dataAmount={dataAmount} data={data} />;
  }, [emptyBucket, data, dataAmount]);

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    return JSON.stringify(initialRetention.current) !== JSON.stringify(retention);
  }, [retention]);

  /**
   */
  useEffect(() => {
    if (tabIndex === 1) {
      mutateDataAmount(dataAmount, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateDataAmount, tabIndex]);

  return (
    <EditPage<IDevice>
      color={theme.bucket}
      description={renderDescription()}
      documentTitle="Bucket"
      icon={EIcon.bucket}
      innerNavTitle={data.name || ""}
      loading={loading}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
      onSave={save}
      onValidate={validate}
      requestPath="device"
      tabIndex={tabIndex}
      tabs={[
        {
          label: "General Information",
          content: renderGeneralInformationTab(),
        },
        {
          label: "Variables",
          content: renderVariables(),
        },
        {
          label: "More",
          content: renderMoreTab(),
        },
      ]}
    />
  );
}

export default BucketEdit;
