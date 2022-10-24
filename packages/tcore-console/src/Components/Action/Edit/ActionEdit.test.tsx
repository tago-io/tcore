vi.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils";
import ActionEdit from "./ActionEdit";

test("renders without crashing", () => {
  const fn = () => render(<ActionEdit />);
  expect(fn).not.toThrowError();
});
