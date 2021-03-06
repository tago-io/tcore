jest.mock("../../../Helpers/useApiRequest.ts");
jest.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils";
import DeviceEdit from "./DeviceEdit";

test("renders without crashing", () => {
  const fn = () => render(<DeviceEdit />);
  expect(fn).not.toThrowError();
});
