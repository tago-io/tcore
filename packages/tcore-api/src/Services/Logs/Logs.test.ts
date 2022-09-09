import { getLogChannelInfo, getLogChannelList } from "./Logs";

describe("getLogChannelInfo", () => {
  test("assure correct type", async () => {
    const data = "string";
    const parsed = await getLogChannelInfo(data);
    expect(parsed).toBeInstanceOf(Array);
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
  test("expect correct type", async () => {
    const data = await getLogChannelList();
    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toBeInstanceOf(Object);
  });
});
