/* eslint-disable no-unused-vars */

export enum ESocketResource {
  pluginInstall = 1,
  deviceInspection = 2,
  log = 3,
  statistic = 4,
  analysis = 5,
  plugin = 5,
  module = 6,
}

export enum ESocketRoom {
  statistic = "room::statistic",
  deviceInspection = "room::device::inspection",
  log = "room::log",
  pluginInstall = "room::plugin::install",
  analysis = "room::analysis",
  plugin = "room::plugin",
  module = "room::plugin::module",
}
