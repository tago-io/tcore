vi.mock("../../../Helpers/useApiRequest.ts");
vi.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils";
import AnalysisEdit from "./AnalysisEdit";

test("renders without crashing", () => {
  const fn = () => render(<AnalysisEdit />);
  expect(fn).not.toThrowError();
});
