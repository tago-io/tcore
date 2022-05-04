import { observable, makeObservable } from "mobx";

interface IStore {
  socketConnected?: boolean;
  version?: string;
}

const store: IStore = {
  socketConnected: false,
  version: "",
};

makeObservable(store, {
  socketConnected: observable,
  version: observable,
});

export default store;
