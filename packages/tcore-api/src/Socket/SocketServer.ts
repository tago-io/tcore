import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { ESocketResource, ESocketRoom, TGenericID } from "@tago-io/tcore-sdk/types";
import { editDevice } from "../Services/Device";

/**
 * Socket server instance.
 */
export let io: SocketServer;

/**
 * Sets up the socket server.
 */
export async function setupSocketServer(httpServer: Server) {
  io = new SocketServer(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("attach", (resourceType: ESocketResource, resourceID?: TGenericID) => {
      if (resourceType === ESocketResource.pluginInstall) {
        socket.join(ESocketRoom.pluginInstall);
      }
      if (resourceType === ESocketResource.log) {
        socket.join(ESocketRoom.log);
      }
      if (resourceType === ESocketResource.statistic) {
        socket.join(ESocketRoom.statistic);
      }
      if (resourceType === ESocketResource.analysis) {
        socket.join(ESocketRoom.analysis);
      }
      if (resourceType === ESocketResource.module && resourceID) {
        socket.join(`${ESocketRoom.module}#${resourceID}`);
      }
      if (resourceType === ESocketResource.plugin && resourceID) {
        socket.join(`${ESocketRoom.plugin}#${resourceID}`);
      }
      if (resourceType === ESocketResource.deviceInspection && resourceID) {
        editDevice(resourceID, { inspected_at: new Date() }).catch(() => false);
        socket.join(`${ESocketRoom.deviceInspection}#${resourceID}`);
      }
    });

    socket.on("detach", (resourceType: ESocketResource, resourceID?: string) => {
      if (resourceType === ESocketResource.pluginInstall) {
        socket.leave(ESocketRoom.pluginInstall);
      }
      if (resourceType === ESocketResource.log) {
        socket.leave(ESocketRoom.log);
      }
      if (resourceType === ESocketResource.statistic) {
        socket.leave(ESocketRoom.statistic);
      }
      if (resourceType === ESocketResource.analysis) {
        socket.leave(ESocketRoom.analysis);
      }
      if (resourceType === ESocketResource.module) {
        socket.leave(`${ESocketRoom.module}#${resourceID}`);
      }
      if (resourceType === ESocketResource.deviceInspection) {
        socket.leave(`${ESocketRoom.deviceInspection}#${resourceID}`);
      }
      if (resourceType === ESocketResource.plugin) {
        socket.leave(`${ESocketRoom.plugin}#${resourceID}`);
      }
    });

    socket.emit("ready");
  });

  io.on("error", console.error);
}
