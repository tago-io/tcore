// we do this workaround to make sure the API always points to the right place,
// regardless in which URL the application is running.
const { location } = window;
process.env.TAGOIO_API = `${location.protocol}//${location.hostname}:${location.port}`;

import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { runInAction } from "mobx";
import { useEffect } from "react";
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

/**
 * Main component of the application.
 */
function App() {
  const { data: status } = useApiRequest<any>("/status");
  const themeObject = lightTheme;

  useEffect(() => {
    if (status) {
      runInAction(() => {
        store.version = status.version;
      });
    }
  }, [status]);

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={imgFavicon} />
      </Helmet>

      <ThemeProvider theme={themeObject as any}>
        <GlobalStyles />

        <BrowserRouter>
          <Switch>
            <Route path="/console" component={renderMainScreen} />
            <Route component={() => null} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

/**
 * Renders the main admin screen, the main screen is the one that has the sidebar and navbar.
 */
function renderMainScreen() {
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
        <Route component={Home} />
      </Switch>
    </MainScreen>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
