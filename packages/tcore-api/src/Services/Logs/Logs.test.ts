import { getLogChannelInfo, getLogChannelList } from "./Logs";

describe("getLogChannelInfo", () => {
  test("assure correct type", () => {
    const data = "string";
    const parsed = getLogChannelInfo(data);
    expect(parsed).toBeInstanceOf(Map);
  });

  test("catch incorrect type", () => {
    const data: any = 0;
    try {
      getLogChannelInfo(data);
    } catch (error) {
      expect(error).toBe("Expected string, received number");
    }
  });
});

describe("getLogChannelList", () => {
  test("expect correct type", () => {
    const data = getLogChannelList();
    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toBeInstanceOf(Object);
  });
});
