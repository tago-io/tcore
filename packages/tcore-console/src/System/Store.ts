import { observable, makeObservable } from "mobx";

const store = {
  socketConnected: false,
};

makeObservable(store, {
  socketConnected: observable,
});

export default store;
