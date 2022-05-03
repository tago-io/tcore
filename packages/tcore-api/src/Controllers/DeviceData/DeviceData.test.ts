import { createServer, Server } from "http";
import express from "express";
import axios from "axios";
import { callbackInterval } from "../../Plugins/Worker/Worker";
import APIController from "../APIController";
import * as Service from "../../Services/DeviceData/DeviceData";
import Controller from "./DeviceData";

const app = express();
let httpServer: Server | null = null;

beforeEach(() => {
  httpServer = createServer(app);
  httpServer.listen(8888);
  Controller(app);
});

afterEach(() => {
  httpServer?.close();
});

afterAll(() => {
  httpServer?.close();
  if (callbackInterval) {
    clearTimeout(callbackInterval);
  }
});

const mockDevice = {
  name: "My Device #1",
  id: "5fa986a120210000264fc684",
};

test("throws error if there isn't a device token", async () => {
  const fn = jest.fn();
  await axios.get("http://localhost:8888/data").catch(fn);
  expect(fn).toHaveBeenCalled();
});

test("throws error if device token isn't valid", async () => {
  const fn = jest.fn();
  await axios.get("http://localhost:8888/data").catch(fn);
  expect(fn).toHaveBeenCalled();
});

test("retrieves value from getDeviceData function", async () => {
  jest.spyOn(APIController.prototype as any, "resolveDeviceFromToken").mockResolvedValue(mockDevice);
  jest.spyOn(Service, "getDeviceData").mockResolvedValue([1, 2, 3] as any);
  const response = await axios.get("http://localhost:8888/data");
  expect(response.data).toEqual({ status: true, result: [1, 2, 3] });
  expect(response.status).toEqual(200);
});

test("calls getDeviceData with correct arguments", async () => {
  const fn = jest.spyOn(Service, "getDeviceData").mockResolvedValue([]);
  await axios.get("http://localhost:8888/data");
  expect(fn).toHaveBeenCalledWith(mockDevice.id, { ordination: "desc", qty: 15, query: "defaultQ", skip: 0 });
});

test("respects query parameter in queryString", async () => {
  const fn = jest.spyOn(Service, "getDeviceData").mockResolvedValue([]);
  await axios.get("http://localhost:8888/data?query=last_value");
  expect(fn).toHaveBeenCalledWith(mockDevice.id, { ordination: "desc", qty: 15, query: "last_value", skip: 0 });
});
