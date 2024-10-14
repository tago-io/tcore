function channelRegex(topic: string = "", ignoreHash: boolean = false) {
  let topicRegex;
  let topicMatch;

  topic = topic.trim();
  topic = topic.replace(new RegExp(" ", "g"), "");

  if (topic.endsWith("/#") && !ignoreHash) {
    topicMatch = topic.replace("/#", "/(?:.*)");
  }

  topicMatch = (topicMatch || topic).replace(new RegExp("\\+", "g"), "[^/]+");
  topicMatch = `^${topicMatch}$`;

  try {
    topicRegex = new RegExp(topicMatch);
  } catch (error) {
    topicRegex = new RegExp("invalid_topic");
  }

  return topicRegex;
}

export default channelRegex;
