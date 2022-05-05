import { IPluginList } from "@tago-io/tcore-sdk/types";
import { observable, makeObservable } from "mobx";

interface IStore {
  socketConnected: boolean;
  plugins: IPluginList;
  version: string;
}

const store: IStore = {
  socketConnected: false,
  plugins: [],
  version: "",
};

makeObservable(store, {
  plugins: observable,
  socketConnected: observable,
  version: observable,
});

export default store;
