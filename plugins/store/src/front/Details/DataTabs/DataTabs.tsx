import axios from "axios";
import { useEffect, useState } from "react";
import { EmptyMessage, EIcon, Loading, Markdown, Tabs } from "@tago-io/tcore-console";
import Screenshots from "../Screenshots/Screenshots";

/**
 * Props.
 */
interface IDataTabsProps {
  markdownURL: string;
  themeColor?: string;
  screenshots: string[];
  pluginID: string;
  pluginVersion: string;
}

/**
 * Shows some extra information of a plugin divided into tabs.
 */
function DataTabs(props: IDataTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [loadingMarkdown, setLoadingMarkdown] = useState(true);
  const [markdownDescription, setMarkdownDescription] = useState("");

  const { markdownURL, pluginID, pluginVersion, themeColor, screenshots } = props;

  /**
   * Renders the markdown description.
   */
  const renderMarkdown = () => {
    if (markdownURL && loadingMarkdown) {
      return <Loading />;
    }

    return markdownDescription ? (
      <Markdown
        localImgPrefix={`https://plugins.tagocore.com/${pluginID}/${pluginVersion}`}
        value={markdownDescription}
      />
    ) : (
      <EmptyMessage icon={EIcon.list} message="No description available." />
    );
  };

  /**
   * Renders screenshots.
   */
  const renderScreenshots = () => {
    return <Screenshots value={screenshots} />;
  };

  /**
   * Fetches the readme data.
   */
  useEffect(() => {
    if (markdownURL) {
      axios
        .get(markdownURL)
        .then((r) => {
          setLoadingMarkdown(false);
          setMarkdownDescription(r.data);
        })
        .catch(() => {
          setLoadingMarkdown(false);
        });
    }
  }, [markdownURL]);

  const tabs = [
    {
      label: "Description",
      content: renderMarkdown(),
    },
  ];

  if (screenshots?.length > 0) {
    tabs.push({
      label: "Screenshots",
      content: renderScreenshots(),
    });
  }

  return (
    <Tabs
      data={tabs}
      titleBackgroundColor={themeColor}
      index={tabIndex}
      onChangeIndex={setTabIndex}
    />
  );
}

export default DataTabs;
