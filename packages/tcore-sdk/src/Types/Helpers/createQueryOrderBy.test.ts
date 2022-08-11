import { ZodEffects } from "zod";
import createQueryOrderBy from "./createQueryOrderBy";

describe("createQueryOrderBy", () => {
  test("return tuple", () => {
    const query = "name, asc";
    const data = createQueryOrderBy(query as any);
    expect(data).toBeInstanceOf(ZodEffects);
  });
});
