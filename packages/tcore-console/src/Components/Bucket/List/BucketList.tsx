import { useTheme } from "styled-components";
import { IDevice } from "@tago-io/tcore-sdk/types";
import { EIcon } from "../../Icon/Icon.types";
import ListPage from "../../ListPage/ListPage";
import RelativeDate from "../../RelativeDate/RelativeDate";
import Capitalize from "../../Capitalize/Capitalize";
import getDeviceList from "../../../Requests/getDeviceList";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName";
import ButtonDataAmount from "./ButtonDataAmount/ButtonDataAmount";

/**
 * The bucket list page.
 */
function BucketList() {
  const theme = useTheme();

  return (
    <ListPage<IDevice>
      color={theme.bucket}
      description="Buckets are where data from your devices is stored and accessed."
      documentTitle="Buckets"
      icon={EIcon.bucket}
      innerNavTitle="Buckets"
      onGetData={getDeviceList}
      path="buckets"
      summaryKey="device"
      columns={[
        {
          id: "name",
          label: "Name",
          onRender: (item) => item.name,
          type: "text",
        },
        {
          flex: "none",
          id: "data_amount",
          label: "Data amount",
          onRender: (item) => <ButtonDataAmount key={item.id} device={item} />,
          width: 180,
        },
        {
          id: "data_retention",
          label: "Retain data for",
          onRender: (item) => <Capitalize>{item.data_retention || "forever"}</Capitalize>,
        },
        {
          id: "type",
          label: "Type",
          onRender: (item) => getDeviceTypeName(item.type),
          filterDisabled: true,
          flex: "none",
          width: 250,
        },
        {
          id: "created_at",
          label: "Created at",
          onRender: (item) => <RelativeDate value={item.created_at} />,
          type: "date",
        },
      ]}
    />
  );
}

export default BucketList;
