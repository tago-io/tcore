vi.mock("./RequestChart/RequestChart.tsx", () => ({ default: () => null }));

import { getSystemName } from "@tago-io/tcore-shared";
import { render, screen } from "../../../utils/test-utils";
import Home from "./Home";

test("renders without crashing", () => {
  const fn = () => render(<Home />);
  expect(fn).not.toThrowError();
});

test("sets document.title", () => {
  render(<Home />);
  expect(document.title).toEqual(`Home | ${getSystemName()}`);
});

test("renders `Summary` card", () => {
  render(<Home />);
  expect(screen.getByText("Summary")).toBeInTheDocument();
  expect(screen.getByTestId("home-summary")).toBeInTheDocument();
});

test("renders `Computer Usage` card", () => {
  render(<Home />);
  expect(screen.getByText("Computer Usage")).toBeInTheDocument();
  expect(screen.getByTestId("home-computer-usage")).toBeInTheDocument();
});

test("renders `Operating System` card", () => {
  render(<Home />);
  expect(screen.getByText("Operating System")).toBeInTheDocument();
  expect(screen.getByTestId("home-os")).toBeInTheDocument();
});
