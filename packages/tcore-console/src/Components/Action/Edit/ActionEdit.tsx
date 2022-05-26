import {
  IAction,
  IPluginConfigField,
  IPluginModuleList,
  zName,
  zTags,
} from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import { observer } from "mobx-react";
import { z } from "zod";
import normalizeTags from "../../../Helpers/normalizeTags";
import EditPage from "../../EditPage/EditPage";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch";
import deleteAction from "../../../Requests/deleteAction";
import TagsTab from "../../Tags/TagsTab";
import editAction from "../../../Requests/editAction/editAction";
import buildZodError from "../../../Validation/buildZodError";
import { useApiRequest } from "../../..";
import validateConfigFields from "../../../Helpers/validateConfigFields";
import {
  IConditionData,
  IScheduleData,
  zFrontAction,
  zFrontActionPost,
  zFrontActionScript,
  zFrontActionTagoIO,
  zFrontConditionDataMultiple,
  zFrontConditionDataSingle,
  zFrontIntervalData,
  zFrontScheduleData,
} from "../Action.types";
import ActionTab from "./ActionTab/ActionTab";
import MoreTab from "./MoreTab/MoreTab";
import { convertActionFromAPI } from "./Logic/convertActionFromAPI";
import { convertActionToAPI } from "./Logic/convertActionToAPI";

/**
 * The Action' edit page.
 */
function ActionEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IAction>({} as IAction);
  const [tabIndex, setTabIndex] = useState(0);
  const { data: typeModules } = useApiRequest<IPluginModuleList>("/module?type=action-type");
  const { data: triggerModules } = useApiRequest<IPluginModuleList>("/module?type=action-trigger");

  /**
   * .action object of the data.
   */
  const [action, setAction] = useState<any>({});

  const [conditionData, setConditionData] = useState<IConditionData>({});
  const [scheduleData, setScheduleData] = useState<IScheduleData>({});
  const [pluginTriggerData, setPluginTriggerData] = useState<any>({});

  const initialData = useRef<IAction>({} as IAction);
  const initialScheduleData = useRef<IScheduleData>({});
  const initialConditionData = useRef<IConditionData>({});
  const initialPluginTriggerData = useRef<any>({});
  const initialAction = useRef<any>({});
  const loading = !data.id;

  const customTrigger = triggerModules?.find((x) => `${x.pluginID}:${x.setup.id}` === data.type);

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
    const conditionDataNorm = {
      ...conditionData,
      device: conditionData?.device?.id || conditionData.device,
    };

    return (
      JSON.stringify(initialDataNorm) !== JSON.stringify(currentDataNorm) ||
      JSON.stringify(initialAction.current) !== JSON.stringify(action) ||
      JSON.stringify(initialPluginTriggerData.current) !== JSON.stringify(pluginTriggerData) ||
      JSON.stringify(initialConditionData.current) !== JSON.stringify(conditionDataNorm) ||
      JSON.stringify(initialScheduleData.current) !== JSON.stringify(scheduleData)
    );
  }, [action, pluginTriggerData, scheduleData, conditionData, data]);
  const [errors, setErrors] = useState<any>({});

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    let error: any = {};

    try {
      if (!action?.type) {
        await zFrontAction.parseAsync(action);
      } else if (action?.type === "script") {
        await zFrontActionScript.parseAsync(action);
      } else if (action?.type === "tagoio") {
        await zFrontActionTagoIO.parseAsync(action);
      } else if (action?.type === "post") {
        await zFrontActionPost.parseAsync(action);
      } else {
        const item = typeModules.find(
          (x) => `${x.pluginID}:${x.setup.id}` === (action.type?.id || action?.type)
        );
        if (item) {
          const err = validateConfigFields(
            item.setup?.option?.configs as IPluginConfigField[],
            action
          );
          if (err) {
            error.action = err;
          }
        }
      }
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      error.action = err;
    }

    try {
      await z
        .object({ name: zName, tags: zTags })
        .parseAsync({ ...data, tags: normalizeTags(data.tags) });

      if (conditionData) {
        const oneUnlock =
          conditionData.unlockConditions?.some((x) => x.variable || x.value) || false;
        if (!oneUnlock) {
          conditionData.unlockConditions = [];
        } else {
          conditionData.unlockConditions?.forEach((x) => {
            if (x.is !== "*") {
              x.value = x.value || undefined;
            }
          });
        }
        conditionData.conditions?.forEach((x) => {
          if (x.is !== "*") {
            x.value = x.value || undefined;
          }
        });
      }

      if (scheduleData.type === "schedule") {
        await zFrontScheduleData.parseAsync(scheduleData);
      } else if (scheduleData.type === "interval") {
        await zFrontIntervalData.parseAsync(scheduleData);
      } else if (conditionData.type === "single") {
        await zFrontConditionDataSingle.parseAsync(conditionData);
      } else if (conditionData.type === "multiple") {
        await zFrontConditionDataMultiple.parseAsync(conditionData);
      } else if (customTrigger) {
        const err = validateConfigFields(
          customTrigger.setup.option.configs as IPluginConfigField[],
          pluginTriggerData
        );
        if (err) {
          error.trigger = err;
        }
      }
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      error = { ...error, ...err };
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
      return false;
    } else {
      setErrors({});
      return true;
    }
  }, [typeModules, action, data, customTrigger, pluginTriggerData, conditionData, scheduleData]);

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((object: IAction) => {
    const parsed = convertActionFromAPI(object);

    setData(object);
    setAction(cloneDeep(parsed.action));
    setScheduleData(parsed.scheduleData);
    setConditionData(parsed.conditionData);
    setPluginTriggerData(parsed.pluginTriggerData);

    initialAction.current = cloneDeep(object.action);
    initialPluginTriggerData.current = cloneDeep(parsed.pluginTriggerData);
    initialScheduleData.current = cloneDeep(parsed.scheduleData);
    initialConditionData.current = cloneDeep(parsed.conditionData);
    initialData.current = cloneDeep(object);
  }, []);

  /**
   * Saves the Action.
   */
  const save = useCallback(async () => {
    const formatted = convertActionToAPI(
      data,
      action,
      scheduleData,
      conditionData,
      pluginTriggerData
    );

    await editAction(id, formatted);

    const conditionDataNorm = {
      ...conditionData,
      device: conditionData?.device?.id || conditionData.device,
    };

    initialAction.current = cloneDeep(action);
    initialPluginTriggerData.current = cloneDeep(pluginTriggerData);
    initialScheduleData.current = cloneDeep(scheduleData);
    initialConditionData.current = cloneDeep(conditionDataNorm);
    initialData.current = cloneDeep(data);
  }, [action, pluginTriggerData, conditionData, scheduleData, id, data]);

  /**
   * Deletes the Action.
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
   * Renders the `Action` tab.
   */
  const renderActionTab = () => {
    return (
      <ActionTab
        customTrigger={customTrigger}
        pluginTriggerData={pluginTriggerData}
        onChangePluginTriggerData={setPluginTriggerData}
        errors={errors}
        scheduleData={scheduleData}
        onChangeScheduleData={setScheduleData}
        action={action}
        onChangeAction={setAction}
        conditionData={conditionData}
        onChangeConditionData={setConditionData}
        data={data}
        onChange={onChangeData}
      />
    );
  };

  /**
   * Renders the `Tags` tab.
   */
  const renderTagsTab = () => {
    return (
      <TagsTab
        data={data.tags}
        errors={errors?.tags}
        name="actions"
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
      requestPath="Action"
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

export default observer(ActionEdit);
