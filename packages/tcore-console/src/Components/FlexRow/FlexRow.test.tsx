import { render } from "../../../utils/test-utils";
import FlexRow from "./FlexRow";

test("renders without crashing", () => {
  const fn = () => render(<FlexRow />);
  expect(fn).not.toThrowError();
});
