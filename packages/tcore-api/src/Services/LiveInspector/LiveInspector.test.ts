import { canLiveInspectorBeActivated, getLiveInspectorID, emitToLiveInspectorViaPlugin } from "./LiveInspector";

describe("canLiveInspectorBeActivated", () => {
  test("assure correct paramater", () => {
    const data = {
      active: true,
    };
    try {
      canLiveInspectorBeActivated(data as any);
    } catch (error) {
      expect(error).toBe("Invalid Device ID");
    }
  });
  test("assure correct return", () => {
    const data = {
      active: true,
      created_at: new Date(1662030591),
      id: "id",
      name: "namae",
      tags: [
        {
          key: "key",
          value: "value",
        },
      ],
    };
    const parsed = canLiveInspectorBeActivated(data);
    expect(parsed).toBeFalsy();
  });
});

describe("getLiveInspectorID", () => {
  test("assure correct paramater", () => {
    const data = {
      active: true,
    };
    try {
      getLiveInspectorID(data as any);
    } catch (error) {
      expect(error).toBe("Invalid Device ID");
    }
  });
});

describe("emitToLiveInspectorViaPlugin", () => {
  test("assure invalid device", async () => {
    const data: any = {
      pluginID: 0,
      deviceID: 0,
      msg: 0,
    };
    try {
      await emitToLiveInspectorViaPlugin(data.pluginID, data.deviceID, data.msg);
    } catch (error) {
      expect((error as any).message).toContain("Invalid Device ID");
    }
  });
});
