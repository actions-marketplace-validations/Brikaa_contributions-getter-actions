const SYMBOL_INDICATOR = "$";
const REPO_NAME = "REPO_NAME";
const NO_COMMITS = "NO_COMMITS";
const PRIMARY_LANGUAGE = "PRIMARY_LANGUAGE";
const HEADER = "HEADER";

const getSymbol = (str: string) => `${SYMBOL_INDICATOR}${str}`;
const formatIncludes = (sentence: string, name: string) =>
  sentence.includes(getSymbol(name));

const validateHeaderFormat = (format: string) => formatIncludes(format, REPO_NAME);
const validateHighlightFormat = (format: string) => formatIncludes(format, HEADER);
