import { io } from "socket.io-client";
import { runInAction } from "mobx";
import store from "./Store";

export const socket = io("/");

socket.on("connect", () => {
  runInAction(() => {
    store.socketConnected = true;
  });
});

socket.on("disconnect", () => {
  runInAction(() => {
    store.socketConnected = false;
  });
});
