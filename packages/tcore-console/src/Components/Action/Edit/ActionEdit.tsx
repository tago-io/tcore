import { useCallback, useRef, useState } from "react";
import { useTheme } from "styled-components";
import {
  IAction,
  IActionOption,
  IActionType,
  ITag,
  IDevice,
  IActionEdit,
  zAction,
} from "@tago-io/tcore-sdk/types";
import { useRouteMatch } from "react-router";
import { cloneDeep } from "lodash";
import useApiRequest from "../../../Helpers/useApiRequest";
import EditPage from "../../EditPage/EditPage";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch";
import normalizeTags from "../../../Helpers/normalizeTags";
import TagsTab from "../../Tags/TagsTab";
import validateConfigFields from "../../../Helpers/validateConfigFields";
import normalizeOption from "../Helpers/normalizeType";
import deleteAction from "../../../Requests/deleteAction";
import editAction from "../../../Requests/editAction/editAction";
import validateOption from "../Helpers/validateOption";
import buildZodError from "../../../Validation/buildZodError";
import ActionTab from "./ActionTab/ActionTab";
import MoreTab from "./MoreTab/MoreTab";

/**
 * The action's edit page.
 */
function ActionEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IAction>({} as IAction);
  const [errors, setErrors] = useState<any>({});
  const [trigger, setTrigger] = useState<any>({});
  const [tabIndex, setTabIndex] = useState(0);
  const [option, setOption] = useState<IActionOption | null>(null);
  const [optionFields, setOptionFields] = useState<any>({});
  const [device, setDevice] = useState<IDevice | null>(null);
  const [tag, setTag] = useState<ITag>({ key: "", value: "" });
  const [deviceType, setDeviceType] = useState<"single" | "multiple">("single");
  const { data: options } = useApiRequest<IActionOption[]>("/action-types");
  const { data: pluginTypes } = useApiRequest<IActionType[]>("/action-triggers");

  const initialData = useRef<IAction>({} as IAction);
  const initialDevice = useRef<IDevice | null>(null);
  const initialOption = useRef<IActionOption | null>(null);
  const initialOptionFields = useRef({});
  const initialTag = useRef<ITag>({ key: "", value: "" });
  const initialTrigger = useRef<any>([]);
  const initialDeviceType = useRef(deviceType);

  const loading = !data.id || !options || !pluginTypes;

  // custom type object provided by the plugin. If this object is !== null then
  // it means that the current action has a custom (plugin) type.
  const customType = pluginTypes?.find((x) => x.id === data.type);

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((action: any) => {
    initialOptionFields.current = { ...action.action };
    initialOption.current = { id: action.action?.type } as any as IActionOption;

    setData(action);
    setOption(action.action?.type);
    setOptionFields({ ...action.action });
    setTrigger(cloneDeep(action.trigger || {}));

    initialData.current = cloneDeep(action);
    initialTrigger.current = cloneDeep(action.trigger || {});

    if (!action.device_info) {
      setDeviceType("single");
    } else if (action.device_info?.id) {
      setDevice(action.device_info.id as IDevice);
      setDeviceType("single");
      initialDevice.current = { id: action.device_info.id } as IDevice;
      initialDeviceType.current = "single";
    } else {
      setDeviceType("multiple");
      setTag({ key: action.device_info?.tag_key, value: action.device_info?.tag_value });
      initialTag.current = {
        key: action.device_info?.tag_key,
        value: action.device_info?.tag_value,
      };
      initialDeviceType.current = "multiple";
    }
  }, []);

  /**
   */
  const formatTriggerToSave = useCallback(() => {
    return trigger;
  }, [trigger]);

  /**
   */
  const formatDeviceInfoToSave = useCallback(() => {
    if (customType && !customType?.showDeviceSelector) {
      return null;
    }
    if (deviceType === "single") {
      return { id: device?.id };
    } else {
      return { tag_key: tag?.key || "", tag_value: tag?.value || "" };
    }
  }, [customType, device?.id, tag?.key, tag?.value, deviceType]);

  /**
   */
  const formatActionToSave = useCallback(() => {
    const formatted = {
      action: { type: option?.id, ...normalizeOption(option, optionFields) },
      active: data.active,
      device_info: formatDeviceInfoToSave(),
      id: data.id,
      name: data.name,
      tags: normalizeTags(data.tags),
      trigger: formatTriggerToSave(),
    };
    return formatted;
  }, [data, option, optionFields, formatDeviceInfoToSave, formatTriggerToSave]);

  /**
   * Validates the `trigger` property of the action.
   * In case the trigger contains an error, this function will only set
   * the error state of the trigger, and nothing else.
   */
  const validateTrigger = useCallback(() => {
    if (customType) {
      const triggerErrors = validateConfigFields(customType.configs, trigger);
      if (triggerErrors) {
        // error during trigger validation
        setErrors({ trigger: triggerErrors });
        return false;
      }
    }
    return true;
  }, [customType, trigger]);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    try {
      const validTrigger = validateTrigger();
      if (!validTrigger) {
        return false;
      }

      const optionError = validateOption(option, optionFields);
      if (optionError) {
        setErrors({ option: optionError });
        return false;
      }

      await zAction.parseAsync({
        ...data,
        tags: normalizeTags(data.tags),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at as Date),
        device_info: formatDeviceInfoToSave(),
        last_triggered: undefined,
      });

      setErrors({});

      return true;
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      if (err.tags) {
        setTabIndex(1);
      } else {
        setTabIndex(0);
      }
      setErrors(err);
      return false;
    }
  }, [data, validateTrigger, option, optionFields, formatDeviceInfoToSave]);

  /**
   * Saves the action.
   */
  const save = useCallback(async () => {
    const formatted = formatActionToSave();

    await editAction(id, formatted as IActionEdit);

    initialDevice.current = { ...device } as IDevice;
    initialOption.current = { ...option } as IActionOption;
    initialOptionFields.current = { ...optionFields };
    initialTag.current = { ...tag };
    initialTrigger.current = cloneDeep(trigger);
    initialDeviceType.current = deviceType;
    initialData.current = cloneDeep(data);
  }, [trigger, id, device, deviceType, tag, data, option, optionFields, formatActionToSave]);

  /**
   * Deletes the action.
   */
  const deleteData = useCallback(async () => {
    await deleteAction(id);
  }, [id]);

  /**
   * Called when a field from a tab gets modified.
   * This will apply the change to the data state.
   */
  const onChangeData = useCallback(
    (field: keyof IAction, value) => {
      setData({ ...data, [field]: value });
    },
    [data]
  );

  /**
   * Renders the `Action` tab's content.
   */
  const renderActionTab = () => {
    return (
      <ActionTab
        customType={customType as any}
        data={data}
        device={device}
        deviceType={deviceType}
        errors={errors}
        onChange={onChangeData}
        onChangeDevice={setDevice}
        onChangeDeviceType={setDeviceType}
        onChangeOption={setOption}
        onChangeOptionFields={setOptionFields}
        onChangeTag={setTag}
        onChangeTrigger={setTrigger}
        option={option}
        optionFields={optionFields}
        options={options}
        tag={tag}
        trigger={trigger}
      />
    );
  };

  /**
   * Renders the `Tags` tab's content.
   */
  const renderTagsTab = () => {
    return (
      <TagsTab
        data={data.tags}
        errors={errors?.tags}
        name="action"
        onChange={(tags) => onChangeData("tags", tags)}
      />
    );
  };

  /**
   * Renders the `More` tab.
   */
  const renderMoreTab = () => {
    return <MoreTab onDelete={deleteData} data={data} />;
  };

  /**
   * Renders the right side of the inner nav.
   */
  const renderInnerNav = useCallback(() => {
    if (loading) {
      // still loading
      return null;
    }

    return (
      <Switch value={data.active} onChange={(e) => onChangeData("active", e)}>
        Active
      </Switch>
    );
  }, [loading, onChangeData, data]);

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    const initialDataNorm = {
      ...initialData.current,
      tags: normalizeTags(initialData.current.tags),
    };
    const currentDataNorm = {
      ...data,
      tags: normalizeTags(data.tags),
    };

    return (
      JSON.stringify(initialDataNorm) !== JSON.stringify(currentDataNorm) ||
      JSON.stringify(initialOptionFields.current) !== JSON.stringify(optionFields) ||
      JSON.stringify(initialTrigger.current) !== JSON.stringify(trigger) ||
      JSON.stringify(initialTag.current) !== JSON.stringify(tag) ||
      initialOption.current?.id !== option?.id ||
      String(initialDevice.current?.id) !== String(device?.id) ||
      initialDeviceType.current !== deviceType
    );
  }, [data, tag, option, device, deviceType, trigger, optionFields]);

  return (
    <EditPage<IAction>
      color={theme.action}
      documentTitle="Action"
      icon={EIcon.bolt}
      innerNavTitle={data.name || "Action"}
      loading={loading}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
      onRenderInnerNav={renderInnerNav}
      onSave={save}
      onValidate={validate}
      requestPath="action"
      tabIndex={tabIndex}
      tabs={[
        {
          label: "Action",
          content: renderActionTab(),
        },
        {
          label: "Tags",
          content: renderTagsTab(),
        },
        {
          label: "More",
          content: renderMoreTab(),
        },
      ]}
    />
  );
}

export default ActionEdit;
