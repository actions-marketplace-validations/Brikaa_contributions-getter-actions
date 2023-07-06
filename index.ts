import { getContributions } from "contributions-getter";
import { Config } from "./types/configTypes";

const writeContributionsMarkdown = async (
  token: string,
  userName: string,
  config: Config = {}
) => {
  const REPO_NAME_SYMBOL = "$REPO_NAME";
  const REPO_URL_SYMBOL = "$REPO_URL";
  const NO_COMMITS_SYMBOL = "$NO_COMMITS";
  const COMMITS_URL_SYMBOL = "$COMMITS_URL";
  const PRIMARY_LANGUAGE_SYMBOL = "$PRIMARY_LANGUAGE";
  const REPO_DESCRIPTION_SYMBOL = "$REPO_DESCRIPTION";
  const HEADER_SYMBOL = "$HEADER";

  const {
    contributionsGetterConfig = {},
    fileAfter,
    fileBefore,
    headerFormat = `[${REPO_NAME_SYMBOL}](${REPO_URL_SYMBOL}) - [${NO_COMMITS_SYMBOL}](${COMMITS_URL_SYMBOL}) \
- ${PRIMARY_LANGUAGE_SYMBOL}\n${REPO_DESCRIPTION_SYMBOL}`,
    highlightFormat = `⭐ ${HEADER_SYMBOL}`,
    minimumStarsForHighlight = 1000,
  } = config;

  const contributions = await getContributions(token, userName);
  const markdown: string[] = [];

  contributions.forEach((c) => {
    markdown.push(`# ${c.startDate} - ${c.endDate}`);
    c.repos.forEach((r) => {
      const header = headerFormat
        .replace(REPO_NAME_SYMBOL, r.name)
        .replace(REPO_URL_SYMBOL, r.url)
        .replace(NO_COMMITS_SYMBOL, r.commits.toString())
        .replace(COMMITS_URL_SYMBOL, r.commitsUrl)
        .replace(
          PRIMARY_LANGUAGE_SYMBOL,
          r.primaryLanguage ?? "No primary language"
        )
        .replace(REPO_DESCRIPTION_SYMBOL, r.description ?? "No description");

      const highlighted =
        r.stars >= minimumStarsForHighlight
          ? highlightFormat.replace(HEADER_SYMBOL, header)
          : header;

      markdown.push(highlightFormat);
    });
  });

  return markdown.join("\n");
};
