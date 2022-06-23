// we do this workaround to make sure the API always points to the right place,
// regardless in which URL the application is running.
const { location } = window;
process.env.TAGOIO_API = `${location.protocol}//${location.hostname}:${location.port}`;

import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { runInAction } from "mobx";
import { useEffect, useState } from "react";
import { IPluginList } from "@tago-io/tcore-sdk/types";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import imgFavicon from "../assets/images/favicon.png";
import { lightTheme } from "./theme";
import MainScreen from "./Components/MainScreen/MainScreen";
import GlobalStyles from "./Components/Styles/GlobalStyles";
import DeviceList from "./Components/Device/List/DeviceList";
import BucketList from "./Components/Bucket/List/BucketList";
import ActionList from "./Components/Action/List/ActionList";
import AnalysisList from "./Components/Analysis/List/AnalysisList";
import Settings from "./Components/Settings/Edit/Settings";
import Home from "./Components/Home/Home";
import Logs from "./Components/Logs/Logs";
import DeviceEdit from "./Components/Device/Edit/DeviceEdit";
import BucketEdit from "./Components/Bucket/Edit/BucketEdit";
import ActionEdit from "./Components/Action/Edit/ActionEdit";
import AnalysisEdit from "./Components/Analysis/Edit/AnalysisEdit";
import PluginEdit from "./Components/Plugins/Edit/PluginEdit";
import useApiRequest from "./Helpers/useApiRequest";
import store from "./System/Store";
import PageIFrame from "./Components/PageIframe/PageIFrame";
import Login from "./Components/Login/Login";
import { getLocalStorage, setLocalStorage } from "./Helpers/localStorage";
import getAccountByToken from "./Requests/getAccountByToken";
import Setup from "./Components/Setup/Setup";
import StepDatabaseError from "./Components/Setup/StepDatabaseError/StepDatabaseError";

/**
 * Main component of the application.
 */
function App() {
  const themeObject = lightTheme;

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={imgFavicon} />
      </Helmet>

      <ThemeProvider theme={themeObject as any}>
        <GlobalStyles />

        <BrowserRouter>
          <StoreWrapper />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

/**
 * Wrapper that does all the authentication logic.
 */
const StoreWrapper = observer(() => {
  const { data: status } = useApiRequest<any>("/status");
  const { data: plugins } = useApiRequest<IPluginList>("/plugin", { skip: !store.token });
  const [readyToRender, setReadyToRender] = useState(false);
  const [token] = useState(() => getLocalStorage("token", ""));
  const history = useHistory();

  /**
   */
  const validateAuth = async () => {
    if (token) {
      // has token, but maybe it's expired
      store.token = token;
      getAccountByToken(token)
        .then((account) => {
          store.account = account;
          setReadyToRender(true);
        })
        .catch(() => {
          store.token = "";
          setLocalStorage("token", "");
          setReadyToRender(true);
          history.push("/console/login");
        });
    } else {
      // not logged in
      store.token = "";
      setReadyToRender(true);
      history.push("/console/login");
    }
  };

  /**
   */
  useEffect(() => {
    if (plugins) {
      runInAction(() => {
        store.plugins = plugins;
      });
    }
  }, [plugins]);

  /**
   */
  useEffect(() => {
    if (status) {
      if (status.database?.error) {
        // database has error
        setReadyToRender(true);
        history.push("/console/database/error");
      } else if (!status.account || !status.database?.configured || !status.master_password) {
        // not configured, go to setup
        setReadyToRender(true);
        history.push("/console/setup");
      } else {
        // configured, validate token
        validateAuth();
      }

      runInAction(() => {
        store.version = status.version;
        store.databaseConfigured = status.database.configured;
        store.databaseError = status.database.error;
        store.masterPasswordConfigured = status.master_password;
        store.accountConfigured = status.account;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!readyToRender) {
    return null;
  }

  return (
    <Switch>
      <Route exact path="/console/database/error" component={StepDatabaseError} />
      <Route exact path="/console/setup" component={Setup} />
      <Route exact path="/console/login" component={Login} />
      <Route path="/console" component={MainScreenWrapper} />
      <Route component={() => null} />
    </Switch>
  );
});

/**
 * Renders the main admin screen, which is the one that has the sidebar and navbar.
 */
function MainScreenWrapper() {
  const { data: pageModules } = useApiRequest<any[]>("/module?type=page");

  return (
    <MainScreen>
      <Switch>
        <Route exact path="/console/actions" component={ActionList} />
        <Route exact path="/console/actions/:id" component={ActionEdit} />
        <Route exact path="/console/analysis" component={AnalysisList} />
        <Route exact path="/console/analysis/:id" component={AnalysisEdit} />
        <Route exact path="/console/buckets" component={BucketList} />
        <Route exact path="/console/buckets/:id" component={BucketEdit} />
        <Route exact path="/console/devices" component={DeviceList} />
        <Route exact path="/console/devices/:id" component={DeviceEdit} />
        <Route exact path="/console/logs" component={Logs} />
        <Route exact path="/console/plugin/:id" component={PluginEdit} />
        <Route exact path="/console/settings" component={Settings} />

        {pageModules?.map((module) => (
          <Route
            exact
            key={module.pluginID}
            path={`/console${module.setup.route}`}
            component={() => <PageIFrame title={module.name} />}
          />
        ))}

        <Route component={Home} />
      </Switch>
    </MainScreen>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
