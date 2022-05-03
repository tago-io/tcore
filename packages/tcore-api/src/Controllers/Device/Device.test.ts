import { createServer, Server } from "http";
import express from "express";
import axios from "axios";
import { callbackInterval } from "../../Plugins/Worker/Worker";
import * as Service from "../../Services/Device";
import Controller from "./Device";

const app = express();
let httpServer: Server | null = null;

beforeAll(() => {
  httpServer = createServer(app);
  httpServer.listen(8888);
  Controller(app);
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

afterAll(() => {
  return new Promise((resolve) => {
    if (callbackInterval) {
      clearTimeout(callbackInterval);
    }
    httpServer?.close(resolve);
  });
});

test("retrieves value from getDeviceData function", async () => {
  jest.spyOn(Service, "getDeviceList").mockResolvedValue([1, 2, 3] as any);
  const response = await axios.get("http://localhost:8888/device");
  expect(response.data).toEqual({ status: true, result: [1, 2, 3] });
  expect(response.status).toEqual(200);
});
