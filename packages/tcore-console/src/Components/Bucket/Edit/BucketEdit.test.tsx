jest.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils";
import BucketEdit from "./BucketEdit";

test("renders without crashing", () => {
  const fn = () => render(<BucketEdit />);
  expect(fn).not.toThrowError();
});
