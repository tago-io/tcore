import { useTheme } from "styled-components";
import { useState } from "react";
import { IAction, IActionOption } from "@tago-io/tcore-sdk/types";
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

/**
 * The device edit page.
 */
function ActionList() {
  const { data } = useApiRequest<IActionOption[]>("/action-types");
  const [modal, setModal] = useState(false);
  const theme = useTheme();

  /**
   * Renders the action type.
   */
  const renderActionType = (item: IAction) => {
    const isCustom = String(item.action?.type).includes(":");
    if (isCustom) {
      const type = data?.find((x) => x.id === item.action?.type);
      return type?.name || "Unknown";
    } else if (item.action?.type === "script") {
      return "Run Analysis";
    } else if (item.action?.type === "post") {
      return "Post data to endpoint using HTTP";
    } else if (item.action?.type === "tagoio") {
      return "Insert data into TagoIO";
    } else {
      return "None";
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
            id: "action",
            label: "Action",
            onRender: renderActionType,
            type: "text",
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
