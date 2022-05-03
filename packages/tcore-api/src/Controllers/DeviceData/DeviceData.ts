import { Application } from "express";
import { z } from "zod";
import { IDeviceDataQuery, zDeviceDataQuery } from "@tago-io/tcore-sdk/types";
import {
  addDeviceDataByDevice,
  deleteDeviceData,
  editDeviceData,
  emptyDevice,
  getDeviceData,
  getDeviceDataAmount,
} from "../../Services/DeviceData/DeviceData";
import { emitToLiveInspector, getLiveInspectorID } from "../../Services/LiveInspector";
import APIController, { ISetupController, warm } from "../APIController";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Adds data into a device.
 */
class AddData extends APIController<any, void, void> {
  setup: ISetupController = {
    allowTokens: [],
    zBodyParser: z.any(), // needs to be any because of raw payload
  };

  async main() {
    const device = await this.resolveDeviceFromToken();

    const liveInspectorID = getLiveInspectorID(device);
    const inspectorMsg = [
      { title: "[POST] HTTP Request", content: this.resolveAgentString() },
      { title: "Query params", content: this.queryStringParams },
    ];
    emitToLiveInspector(device, inspectorMsg, liveInspectorID);

    const result = await addDeviceDataByDevice(device, this.bodyParams, { liveInspectorID });
    this.body = result;
    this.successStatus = 202;
  }
}

/**
 * Deletes data from a device.
 */
class DeleteData extends APIController<void, IDeviceDataQuery, void> {
  setup: ISetupController = {
    allowTokens: [],
    zQueryStringParser: zDeviceDataQuery,
  };

  async main() {
    const device = await this.resolveDeviceFromToken();
    const result = await deleteDeviceData(device.id, this.queryStringParams);
    this.body = `${result} Data removed`;
  }
}

/**
 * Gets the device data by device token.
 */
class GetDataByToken extends APIController<void, IDeviceDataQuery, void> {
  setup: ISetupController = {
    allowTokens: [],
    zQueryStringParser: zDeviceDataQuery,
  };

  async main() {
    const device = await this.resolveDeviceFromToken();
    const result = await getDeviceData(device.id, this.queryStringParams);
    this.body = result;
  }
}

/**
 * Edits device data by device id.
 */
class EditDataByDeviceID extends APIController<any, void, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zBodyParser: z.any(),
    zURLParamsParser: zURLParamsID,
  };

  async main() {
    const result = await editDeviceData(this.urlParams.id, this.bodyParams);
    this.body = result;
  }
}

/**
 * Delete device data by id.
 */
class DeleteDataByDeviceID extends APIController<void, IDeviceDataQuery, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zQueryStringParser: zDeviceDataQuery,
    zURLParamsParser: zURLParamsID,
  };

  async main() {
    const result = await deleteDeviceData(this.urlParams.id, this.queryStringParams);
    this.body = result;
  }
}

/**
 * Gets the device data by the device id.
 */
class GetDataByID extends APIController<void, IDeviceDataQuery, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zQueryStringParser: zDeviceDataQuery,
    zURLParamsParser: zURLParamsID,
  };

  async main() {
    const result = await getDeviceData(this.urlParams.id, this.queryStringParams);
    this.body = result;
  }
}

/**
 * Deletes variables of a device.
 */
class EmptyDevice extends APIController<void, void, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  async main() {
    await emptyDevice(this.urlParams.id);
    this.body = "Successfully Removed";
  }
}

/**
 * Retrieves the data amount of a device.
 */
class GetDataAmount extends APIController<void, void, z.infer<typeof zURLParamsID>> {
  setup: ISetupController = {
    allowTokens: [],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getDeviceDataAmount(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Exports the routes of the device.
 */
export default (app: Application) => {
  app.get("/device/:id/data", warm(GetDataByID));
  app.post("/device/:id/empty", warm(EmptyDevice));
  app.put("/device/:id/data", warm(EditDataByDeviceID));
  app.delete("/device/:id/data", warm(DeleteDataByDeviceID));
  app.get("/device/:id/data_amount", warm(GetDataAmount));

  app.delete("/data", warm(DeleteData));
  app.get("/data", warm(GetDataByToken));
  app.post("/data", warm(AddData));
};
