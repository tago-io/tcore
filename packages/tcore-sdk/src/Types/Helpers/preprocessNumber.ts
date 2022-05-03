function preprocessNumber(value: any): any {
  if (value === true || value === false) {
    return "";
  }
  return Number(value);
}

export default preprocessNumber;
