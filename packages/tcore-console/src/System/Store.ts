import { IAccount, IPluginList } from "@tago-io/tcore-sdk/types";
import { observable, makeObservable } from "mobx";

interface IStore {
  socketConnected?: boolean;
  plugins: IPluginList;
  version: string;
  account?: IAccount;
  token: string;
}

const store: IStore = {
  socketConnected: false,
  plugins: [],
  version: "",
  account: undefined,
  token: "",
};

makeObservable(store, {
  plugins: observable,
  socketConnected: observable,
  version: observable,
  account: observable,
  token: observable,
});

export default store;
