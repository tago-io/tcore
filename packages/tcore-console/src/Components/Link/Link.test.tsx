import { render, screen } from "../../../utils/test-utils";
import Link from "./Link";

test("renders without crashing", () => {
  const fn = () => render(<Link href="#" />);
  expect(fn).not.toThrowError();
});

test("respects `href` prop", async () => {
  render(<Link href="/console/test" />);
  const link = screen.getByRole("link");
  expect(link).not.toBeDisabled();
  expect(link).toHaveProperty("href", "http://localhost/console/test");
});

test("respects `target` prop", async () => {
  render(<Link target="_blank" href="/console/test" />);
  const link = screen.getByRole("link");
  expect(link).toHaveProperty("target", "_blank");
});
