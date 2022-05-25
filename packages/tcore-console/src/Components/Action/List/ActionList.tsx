import { useTheme } from "styled-components";
import { useState } from "react";
import { IAction, IPluginModuleList } from "@tago-io/tcore-sdk/types";
import BooleanStatus from "../../BooleanStatus/BooleanStatus";
import Button from "../../Button/Button";
import { EButton } from "../../Button/Button.types";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import ListPage from "../../ListPage/ListPage";
import RelativeDate from "../../RelativeDate/RelativeDate";
import ModalAddAction from "../Common/ModalAddAction/ModalAddAction";
import useApiRequest from "../../../Helpers/useApiRequest";
import getActionList from "../../../Requests/getActionList";
import * as Style from "./ActionList.style";

/**
 * The device edit page.
 */
function ActionList() {
  const { data: types } = useApiRequest<IPluginModuleList>("/module?type-action-type");
  const { data: triggers } = useApiRequest<IPluginModuleList>("/module?type-action-trigger");
  const [modal, setModal] = useState(false);
  const theme = useTheme();

  /**
   * Renders an icon and a text.
   */
  const renderIcon = (color: string, icon: EIcon, text: string) => {
    return (
      <Style.Icon>
        <Icon color={color} icon={icon} />
        <span style={{ color }}> {text}</span>
      </Style.Icon>
    );
  };

  /**
   * Renders the trigger.
   */
  const renderTriggerType = (item: IAction) => {
    const isCustom = String(item.type).includes(":");
    if (isCustom) {
      const type = triggers?.find((x) => `${x.pluginID}:${x.setup.id}` === item.type);
      return renderIcon(theme.extension, EIcon["puzzle-piece"], type?.setup?.name || "Unknown");
    } else if (item.type === "condition") {
      return renderIcon(theme.bucket, EIcon.database, "Variable");
    } else if (item.type === "interval" || item.type === "schedule") {
      return renderIcon(theme.action, EIcon.clock, "Schedule");
    } else {
      return "Unknown";
    }
  };

  /**
   * Renders the action.
   */
  const renderActionType = (item: IAction) => {
    const isCustom = String(item.action?.type).includes(":");
    if (isCustom) {
      const type = types?.find((x) => `${x.pluginID}:${x.setup.id}` === item.action?.type);
      return type?.setup?.name || "Unknown";
    } else if (item.action?.type === "script") {
      return "Run Analysis";
    } else if (item.action?.type === "post") {
      return "Post data to endpoint using HTTP";
    } else if (item.action?.type === "tagoio") {
      return "Insert data into TagoIO";
    } else {
      return "Unknown";
    }
  };

  return (
    <>
      <ListPage<IAction>
        color={theme.action}
        description="Actions give you total control over your devices based on events determined by you."
        icon={EIcon.bolt}
        path="actions"
        innerNavTitle="Actions"
        documentTitle="Actions"
        onGetData={getActionList}
        summaryKey="action"
        columns={[
          {
            id: "name",
            label: "Name",
            onRender: (item) => item.name,
            type: "text",
          },
          {
            id: "trigger",
            label: "Trigger By",
            onRender: renderTriggerType,
            type: "text",
            filterDisabled: true,
          },
          {
            id: "action",
            label: "Action",
            onRender: renderActionType,
            type: "text",
            filterDisabled: true,
          },
          {
            flex: "none",
            id: "active",
            label: "Active",
            onRender: (item) => <BooleanStatus value={item.active} />,
            type: "boolean",
            width: 100,
          },
          {
            id: "last_triggered",
            label: "Last triggered",
            onRender: (item) => <RelativeDate value={item.last_triggered} />,
            type: "date",
          },
          {
            id: "created_at",
            label: "Created at",
            onRender: (item) => <RelativeDate value={item.created_at} />,
            type: "date",
          },
        ]}
      >
        <Button
          addIconMargin
          color={theme.action}
          onClick={() => setModal(true)}
          type={EButton.primary}
        >
          <Icon icon={EIcon.plus} />
          <span>Add Action</span>
        </Button>
      </ListPage>

      {modal && <ModalAddAction onClose={() => setModal(false)} />}
    </>
  );
}

export default ActionList;
