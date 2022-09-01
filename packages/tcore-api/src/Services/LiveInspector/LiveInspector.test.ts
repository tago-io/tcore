import { canLiveInspectorBeActivated, getLiveInspectorID, emitToLiveInspectorViaPlugin } from "./LiveInspector";

describe("canLiveInspectorBeActivated", () => {
  test("assure correct paramater", () => {
    const data = {
      active: true,
    };
    try {
      canLiveInspectorBeActivated(data as any);
    } catch (error) {
      expect(error).toBe("Required");
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
    expect(parsed).toBeInstanceOf(Boolean);
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
      expect(error).toBe("Required");
    }
  });
});

describe("emitToLiveInspectorViaPlugin", () => {
  test("assure correct paramater", () => {
    const data: any = {
      pluginID: 0,
      deviceID: 0,
      msg: 0,
    };
    try {
      emitToLiveInspectorViaPlugin(data.pluginID, data.deviceID, data.msg);
    } catch (error) {
      expect(error).toBe("Expected string, recieved number");
    }
  });
});
