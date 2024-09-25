import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { useRouteMatch } from "react-router";
import { EIcon, EmptyMessage, Loading, useApiRequest } from "@tago-io/tcore-console";
import Sidebar from "./Sidebar/Sidebar";
import Banner from "./Banner/Banner";
import * as Style from "./PluginDetails.style";
import DataTabs from "./DataTabs/DataTabs";

/**
 * Query to fetch the details of the plugin.
 */
const QUERY = gql`
  query ($id: String!, $version: String) {
    pluginInfo(id: $id, version: $version) {
      categories
      id
      logo_url
      name
      class_types
      permissions
      platforms
      created_at
      theme_color
      compatibility {
        tcore_version
        cluster
      }
      install_urls {
        platform
        url
      }
      full_description_url
      publisher {
        name
        domain
      }
      short_description
      version
      versions
    }
  }
`;

/**
 * The plugin details page.
 */
function PluginDetails() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const [selectedVersion, setSelectedVersion] = useState(() => "");

  const { data: platform } = useApiRequest<string>("/hardware/platform");
  const { data: queryData, error } = useQuery(QUERY, {
    skip: !platform,
    variables: { id, platform, version: selectedVersion },
    fetchPolicy: "network-only",
  });

  const plugin = queryData?.pluginInfo;
  const urls = plugin?.install_urls || [];
  const installURL =
    urls.find((x: any) => x?.platform === platform)?.url ||
    urls.find((x: any) => x?.platform === "any")?.url;

  const loading = !plugin;

  /**
   * Updates the URL with the new selected version.
   */
  useEffect(() => {
    if (selectedVersion) {
      history.replaceState(
        null,
        "",
        `/console/pluginstore/details/${id}?version=${selectedVersion}`
      );
    }
  }, [id, selectedVersion]);

  /**
   */
  useEffect(() => {
    window.top?.postMessage({ type: "set-link", url: `/pages/pluginstore/details/${id}` }, "*");
  }, [id]);

  if (error) {
    return (
      <EmptyMessage
        icon={EIcon.wifi}
        message={
          <Style.ConnectErrorMsg>
            <h1>Could not connect to the Plugin Store.</h1>
            <div>Make sure you have internet access and try again later.</div>
          </Style.ConnectErrorMsg>
        }
      />
    );
  }

  if (loading) {
    // if the screen is loading we show a loading status
    return <Loading />;
  }

  return (
    <Style.Container>
      <Banner
        plugin={plugin}
        installURL={installURL}
        onChangeSelectedVersion={setSelectedVersion}
        selectedVersion={selectedVersion || plugin.versions[0]}
        systemPlatform={platform}
      />

      <div className="content">
        <div className="data-tabs-container">
          <DataTabs
            markdownURL={plugin.full_description_url}
            screenshots={plugin.screenshots}
            themeColor={plugin.theme_color}
            pluginVersion={selectedVersion || plugin.versions[0]}
            pluginID={id}
          />
        </div>

        <Sidebar
          categories={plugin.categories || []}
          classTypes={plugin.class_types || []}
          permissions={plugin.permissions || []}
          platforms={plugin.platforms || []}
          publishDate={plugin.created_at}
          publisherName={plugin.publisher?.name}
          publisherDomain={plugin.publisher.domain}
          version={plugin.version}
        />
      </div>
    </Style.Container>
  );
}

export default PluginDetails;
