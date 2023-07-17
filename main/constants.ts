import { getContributions } from "contributions-getter";
import { sortByCommits } from "../functions/sortReposFunctions";

// To be used in header format. Represents the name of the repository
export const REPO_NAME_SYMBOL = "$REPO_NAME" as const;
// To be used in header format. Represents the URL of the repository
export const REPO_URL_SYMBOL = "$REPO_URL" as const;
// To be used in header format. Represents the number of commits the user has made in that repository
export const NO_COMMITS_SYMBOL = "$NO_COMMITS" as const;
// To be used in header format. Represents the URL of the commits in that certain time period
export const COMMITS_URL_SYMBOL = "$COMMITS_URL" as const;
// To be used in header format. Represents the primary language that is used in that repo
export const PRIMARY_LANGUAGE_SYMBOL = "$PRIMARY_LANGUAGE" as const;
// To be used in header format. Represents the description of the repository
export const REPO_DESCRIPTION_SYMBOL = "$REPO_DESCRIPTION" as const;
// To be used in highlight format. Represents the result of the header format after replacing the special keywords
export const HEADER_SYMBOL = "$HEADER" as const;

// The default header format:
// [$REPO_NAME]($REPO_URL) - [$NO_COMMITS]($COMMITS_URL) - $PRIMARY_LANGUAGE\n$REPO_DESCRIPTION
export const DEFAULT_HEADER_FORMAT =
  `[${REPO_NAME_SYMBOL}](${REPO_URL_SYMBOL}) \
- [${NO_COMMITS_SYMBOL}](${COMMITS_URL_SYMBOL}) - ${PRIMARY_LANGUAGE_SYMBOL}\n${REPO_DESCRIPTION_SYMBOL}` as const;

// The default highlight format:
// ⭐ $HEADER
export const DEFAULT_HIGHLIGHT_FORMAT = `⭐ ${HEADER_SYMBOL}` as const;
export const DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT = 1000 as const;
export const DEFAULT_REPOS_TO_IGNORE = [] as const;

export const DEFAULT_SORT_REPOS_FN = sortByCommits;
export const DEFAULT_MOCK_GET_CONTRIBUTIONS_FN = getContributions;

export const MOCK_GET_CONTRIBUTIONS_FN_TYPES = [
  "EMPTY",
  "SINGLE",
  "MULTIPLE",
] as const;
export const SORT_REPOS_FN_TYPES = ["COMMITS", "STARS"] as const;
