import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { theme, GlobalStyles } from "@tago-io/tcore-console";
import PluginStore from "./Store/PluginStore";
import PluginDetails from "./Details/PluginDetails";

/**
 * Apollo client to use queries in components.
 */
const apolloClient = new ApolloClient({
  uri: "https://api.tagocore.com/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={apolloClient as any}>
    <ThemeProvider theme={theme.lightTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <Switch>
          <Route exact path="/pages/pluginstore/details/:id" component={PluginDetails} />
          <Route exact path="/pages/pluginstore/" component={PluginStore} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
