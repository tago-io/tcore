import { DatabaseModule, helpers } from "@tago-io/tcore-sdk";
import addDeviceData from "./Providers/DeviceData/addDeviceData";
import editDeviceData from "./Providers/DeviceData/editDeviceData";
import createAction from "./Providers/Action/createAction";
import createAnalysis from "./Providers/Analysis/createAnalysis";
import createDevice from "./Providers/Device/createDevice";
import createDeviceToken from "./Providers/Device/createDeviceToken";
import deleteAction from "./Providers/Action/deleteAction";
import deleteAnalysis from "./Providers/Analysis/deleteAnalysis";
import deleteDevice from "./Providers/Device/deleteDevice";
import deleteDeviceParam from "./Providers/Device/deleteDeviceParam";
import deleteDeviceToken from "./Providers/Device/deleteDeviceToken";
import editAction from "./Providers/Action/editAction";
import editAnalysis from "./Providers/Analysis/editAnalysis";
import editDevice from "./Providers/Device/editDevice";
import getActionInfo from "./Providers/Action/getActionInfo";
import getActionList from "./Providers/Action/getActionList";
import getAnalysisInfo from "./Providers/Analysis/getAnalysisInfo";
import getAnalysisList from "./Providers/Analysis/getAnalysisList";
import getDeviceDataDefaultQ from "./Providers/DeviceData/getDeviceDataDefaultQ";
import getDeviceDataAmount from "./Providers/DeviceData/getDeviceDataAmount";
import getDeviceByToken from "./Providers/Device/getDeviceByToken";
import getDeviceInfo from "./Providers/Device/getDeviceInfo";
import getDeviceList from "./Providers/Device/getDeviceList";
import getDeviceParamList from "./Providers/Device/getDeviceParamList";
import getDeviceTokenList from "./Providers/Device/getDeviceTokenList";
import getPluginStorageItem from "./Providers/PluginStorage/getPluginStorageItem";
import getSummary from "./Providers/Summary/getSummary";
import deletePluginStorageItem from "./Providers/PluginStorage/deletePluginStorageItem";
import setDeviceParams from "./Providers/Device/setDeviceParams";
import { destroyKnex, setupKnex } from "./knex";
import getTagKeys from "./Providers/Tag/getTagKeys";
import addStatistic from "./Providers/Statistic/addStatistic";
import getHourlyStatistics from "./Providers/Statistic/getHourlyStatistics";
import emptyDevice from "./Providers/Device/emptyDevice";
import getDeviceDataLastValue from "./Providers/DeviceData/getDeviceDataLastValue";
import getDeviceDataLastLocation from "./Providers/DeviceData/getDeviceDataLastLocation";
import getDeviceDataLastItem from "./Providers/DeviceData/getDeviceDataLastItem";
import getDeviceDataLastInsert from "./Providers/DeviceData/getDeviceDataLastInsert";
import getDeviceDataFirstValue from "./Providers/DeviceData/getDeviceDataFirstValue";
import getDeviceDataFirstLocation from "./Providers/DeviceData/getDeviceDataFirstLocation";
import getDeviceDataFirstItem from "./Providers/DeviceData/getDeviceDataFirstItem";
import getDeviceDataFirstInsert from "./Providers/DeviceData/getDeviceDataFirstInsert";
import getDeviceDataCount from "./Providers/DeviceData/getDeviceDataCount";
import getDeviceDataMax from "./Providers/DeviceData/getDeviceDataMax";
import getDeviceDataMin from "./Providers/DeviceData/getDeviceDataMin";
import getDeviceDataAvg from "./Providers/DeviceData/getDeviceDataAvg";
import getDeviceDataSum from "./Providers/DeviceData/getDeviceDataSum";
import addAnalysisLog from "./Providers/Analysis/addAnalysisLog";
import getAnalysisLogs from "./Providers/Analysis/getAnalysisLogs";
import deleteDeviceData from "./Providers/DeviceData/deleteDeviceData";
import setPluginStorageItem from "./Providers/PluginStorage/setPluginStorageItem";
import getAllPluginStorageItems from "./Providers/PluginStorage/getAllPluginStorageItem";
import createAccountToken from "./Providers/Account/createAccountToken";
import getAccountByToken from "./Providers/Account/getAccountByToken";
import getAccountInfo from "./Providers/Account/getAccountInfo";
import createAccount from "./Providers/Account/createAccount";
import getAccountList from "./Providers/Account/getAccountList";
import getAccountToken from "./Providers/Account/getAccountToken";
import getAccountAmount from "./Providers/Account/getAccountAmount";
import getAccountByUsername from "./Providers/Account/getAccountByUsername";
import getDeviceToken from "./Providers/Device/getDeviceToken";
import applyDeviceDataRetention from "./Providers/DeviceData/applyDeviceDataRetention";
import deleteAnalysisLogs from "./Providers/Analysis/deleteAnalysisLogs";

/**
 * Starts the database module.
 */
async function startModule() {
  const filename = await helpers.getFileURI("data.db");
  const sqlite = new DatabaseModule({
    id: "sqlite",
    name: "SQLite",
    configs: [
      {
        type: "file",
        field: "file",
        name: "Database file",
        icon: "database",
        defaultValue: filename,
      },
    ],
  });

  sqlite.onLoad = setupKnex;
  sqlite.onDestroy = destroyKnex;

  sqlite.addAnalysisLog = addAnalysisLog;
  sqlite.addDeviceData = addDeviceData;
  sqlite.addStatistic = addStatistic;
  sqlite.applyDeviceDataRetention = applyDeviceDataRetention;
  sqlite.createAccount = createAccount;
  sqlite.createAccountToken = createAccountToken;
  sqlite.createAction = createAction;
  sqlite.createAnalysis = createAnalysis;
  sqlite.createDevice = createDevice;
  sqlite.createDeviceToken = createDeviceToken;
  sqlite.deleteAction = deleteAction;
  sqlite.deleteAnalysis = deleteAnalysis;
  sqlite.deleteAnalysisLogs = deleteAnalysisLogs;
  sqlite.deleteDevice = deleteDevice;
  sqlite.deleteDeviceData = deleteDeviceData;
  sqlite.deleteDeviceParam = deleteDeviceParam;
  sqlite.deleteDeviceToken = deleteDeviceToken;
  sqlite.deletePluginStorageItem = deletePluginStorageItem;
  sqlite.editAction = editAction;
  sqlite.editAnalysis = editAnalysis;
  sqlite.editDevice = editDevice;
  sqlite.editDeviceData = editDeviceData;
  sqlite.emptyDevice = emptyDevice;
  sqlite.getAccountAmount = getAccountAmount;
  sqlite.getAccountByToken = getAccountByToken;
  sqlite.getAccountByUsername = getAccountByUsername;
  sqlite.getAccountInfo = getAccountInfo;
  sqlite.getAccountList = getAccountList;
  sqlite.getAccountToken = getAccountToken;
  sqlite.getActionInfo = getActionInfo;
  sqlite.getActionList = getActionList;
  sqlite.getAllPluginStorageItems = getAllPluginStorageItems;
  sqlite.getAnalysisInfo = getAnalysisInfo;
  sqlite.getAnalysisList = getAnalysisList;
  sqlite.getAnalysisLogs = getAnalysisLogs;
  sqlite.getDeviceByToken = getDeviceByToken;
  sqlite.getDeviceDataAmount = getDeviceDataAmount;
  sqlite.getDeviceDataAvg = getDeviceDataAvg;
  sqlite.getDeviceDataCount = getDeviceDataCount;
  sqlite.getDeviceDataDefaultQ = getDeviceDataDefaultQ;
  sqlite.getDeviceDataFirstInsert = getDeviceDataFirstInsert;
  sqlite.getDeviceDataFirstItem = getDeviceDataFirstItem;
  sqlite.getDeviceDataFirstLocation = getDeviceDataFirstLocation;
  sqlite.getDeviceDataFirstValue = getDeviceDataFirstValue;
  sqlite.getDeviceDataLastInsert = getDeviceDataLastInsert;
  sqlite.getDeviceDataLastItem = getDeviceDataLastItem;
  sqlite.getDeviceDataLastLocation = getDeviceDataLastLocation;
  sqlite.getDeviceDataLastValue = getDeviceDataLastValue;
  sqlite.getDeviceDataMax = getDeviceDataMax;
  sqlite.getDeviceDataMin = getDeviceDataMin;
  sqlite.getDeviceDataSum = getDeviceDataSum;
  sqlite.getDeviceInfo = getDeviceInfo;
  sqlite.getDeviceList = getDeviceList;
  sqlite.getDeviceParamList = getDeviceParamList;
  sqlite.getDeviceToken = getDeviceToken;
  sqlite.getDeviceTokenList = getDeviceTokenList;
  sqlite.getHourlyStatistics = getHourlyStatistics;
  sqlite.getPluginStorageItem = getPluginStorageItem;
  sqlite.getSummary = getSummary;
  sqlite.getTagKeys = getTagKeys;
  sqlite.setDeviceParams = setDeviceParams;
  sqlite.setPluginStorageItem = setPluginStorageItem;
}

startModule();
