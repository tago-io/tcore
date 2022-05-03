import axios from "axios";
import editAction from "./editAction";

beforeEach(() => {
  jest.clearAllMocks();
});

test("calls correct route", async () => {
  const fn = jest.spyOn(axios, "put").mockResolvedValue({});
  await editAction("61264520fee2db1b98b6a37c", { active: false });
  expect(fn).toHaveBeenCalledWith("/action/61264520fee2db1b98b6a37c", { active: false });
});

test("returns correct value", async () => {
  jest.spyOn(axios, "put").mockResolvedValue({});
  const response = await editAction("61264520fee2db1b98b6a37c", { active: false });
  expect(response).toBeUndefined();
});
