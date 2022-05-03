/**
 * Sets the document.title with a prefix.
 */
function setDocumentTitle(title: string) {
  if (title) {
    document.title = `${title} | TCore`;
  }
}

export default setDocumentTitle;
