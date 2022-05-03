jest.mock("../../Helpers/useApiRequest.ts");

import { within } from "@testing-library/react";
import { render, screen } from "../../../utils/test-utils";
import Sidebar from "./Sidebar";

test("renders without crashing", () => {
  const fn = () => render(<Sidebar open={false} />);
  expect(fn).not.toThrowError();
});

test("renders Home button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("home") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/");
  expect(within(button).getByText("home-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Home")).toBeInTheDocument();
});

test("renders Devices button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("devices") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/devices/");
  expect(within(button).getByText("device-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Devices")).toBeInTheDocument();
});

test("renders Buckets button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("buckets") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/buckets/");
  expect(within(button).getByText("bucket-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Buckets")).toBeInTheDocument();
});

test("renders Analysis button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("analysis") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/analysis/");
  expect(within(button).getByText("code-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Analysis")).toBeInTheDocument();
});

test("renders Actions button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("actions") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/actions/");
  expect(within(button).getByText("bolt-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Actions")).toBeInTheDocument();
});

test("renders Settings button", () => {
  render(<Sidebar open={false} />);
  const button = screen.getByTestId("settings") as HTMLLinkElement;
  expect(button.href).toEqual("http://localhost/console/settings/");
  expect(within(button).getByText("cog-icon-mock")).toBeInTheDocument();
  expect(within(button).getByText("Settings")).toBeInTheDocument();
});
