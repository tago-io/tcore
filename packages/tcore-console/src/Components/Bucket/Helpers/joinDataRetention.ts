/**
 * Joins the data retention into one single field.
 */
function joinBucketDataRetention(retention: any) {
  if (retention.unit === "forever") {
    return "forever";
  } else {
    return `${retention.value} ${String(retention.unit).toLowerCase()}`;
  }
}

export default joinBucketDataRetention;
