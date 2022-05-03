import { render, screen } from "../../../utils/test-utils";
import { EIcon } from "../Icon/Icon.types";
import Item from "./Item";

/**
 * Default (required) props for the component.
 */
const defaultProps: any = {
  url: "",
  text: "",
  color: "",
};

test("renders without crashing", () => {
  const fn = () => render(<Item {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders link", () => {
  render(<Item {...defaultProps} url="/path/123" />);
  const link = screen.getByRole("link");
  expect(link).toHaveProperty("href", "http://localhost/path/123");
});

test("renders text", () => {
  render(<Item {...defaultProps} text="My Item" />);
  expect(screen.getByText("My Item")).toBeInTheDocument();
});

test("renders icon", () => {
  render(<Item {...defaultProps} icon={EIcon.home} />);
  expect(screen.getByText("home-icon-mock")).toBeInTheDocument();
});
