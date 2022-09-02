import { refineOrderBy } from "./refineOrderBy";

describe("refineOrderBy", () => {
  test("assure correct validation", () => {
    const data = "asc";
    const process = refineOrderBy(data);
    expect(process).toBeTruthy();
  });
});
