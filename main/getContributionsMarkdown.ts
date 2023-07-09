import { getContributions } from "contributions-getter";
import { Config, GetContributionsType } from "../types/configTypes";
import {
  COMMITS_URL_SYMBOL,
  DEFAULT_HEADER_FORMAT,
  DEFAULT_HIGHLIGHT_FORMAT,
  DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT,
  DEFAULT_MONTHS_INTERVAL,
  HEADER_SYMBOL,
  NO_COMMITS_SYMBOL,
  PRIMARY_LANGUAGE_SYMBOL,
  REPO_DESCRIPTION_SYMBOL,
  REPO_NAME_SYMBOL,
  REPO_URL_SYMBOL,
} from "./constants";
import { Environment } from "../types/envTypes";
import { readFileSync } from "fs";
import { cleanEnv, makeValidator, str } from "envalid";

const getContributionsMarkdown = async (
  token: string,
  userName: string,
  config: Config = {}
) => {
  const {
    contributionsGetterConfig = {},
    fileBefore,
    fileAfter,
    headerFormat = DEFAULT_HEADER_FORMAT,
    highlightFormat = DEFAULT_HIGHLIGHT_FORMAT,
    minimumStarsForHighlight = DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT,
    getContributionsFn = getContributions,
  } = config;

  const markdown: string[] = [];
  if (fileBefore !== undefined)
    markdown.push(readFileSync(fileBefore).toString());

  // Need to read the afterFile early in order to fail on error without wasting API quota
  const contentAfter =
    fileAfter === undefined ? null : readFileSync(fileAfter).toString();

  const contributionsYears = await getContributionsFn(
    token,
    userName,
    contributionsGetterConfig
  );

  contributionsYears
    .filter((cy) => cy.repos.length > 0)
    .forEach((cy) => {
      markdown.push(
        `## ${cy.startDate.toDateString()} - ${cy.endDate.toDateString()}\n\n<details>\n`
      );
      cy.repos
        .filter((r) => !r.isPrivate)
        .forEach((r) => {
          const header = headerFormat
            .replace(REPO_NAME_SYMBOL, r.name)
            .replace(REPO_URL_SYMBOL, r.url)
            .replace(
              NO_COMMITS_SYMBOL,
              r.commits.toString() + (r.commits === 1 ? " commit" : " commits")
            )
            .replace(COMMITS_URL_SYMBOL, r.commitsUrl)
            .replace(
              PRIMARY_LANGUAGE_SYMBOL,
              r.primaryLanguage ?? "No primary language"
            )
            .replace(
              REPO_DESCRIPTION_SYMBOL,
              r.description ?? "No description"
            );

          const highlighted =
            r.stars >= minimumStarsForHighlight
              ? highlightFormat.replace(HEADER_SYMBOL, header)
              : header;

          markdown.push(`### ${highlighted}\n`);
        });
      markdown.push(`</details>\n`);
    });

  if (contentAfter !== null) markdown.push(contentAfter);
  return markdown.join("\n").trim();
};

export const getContributionsMarkdownUsingEnvConfig = async (
  getContributionsFn: GetContributionsType = getContributions
) => {
  const int = makeValidator((x) => {
    const xInt = parseInt(x);
    if (isNaN(xInt)) throw new Error("Expected a number");
    else return xInt;
  });
  const env = cleanEnv<Environment>(process.env, {
    GITHUB_TOKEN: str(),
    GITHUB_USERNAME: str(),
    FILE_AFTER: str({ default: undefined }),
    FILE_BEFORE: str({ default: undefined }),
    HEADER_FORMAT: str({ default: DEFAULT_HEADER_FORMAT }),
    HIGHLIGHT_FORMAT: str({ default: DEFAULT_HIGHLIGHT_FORMAT }),
    MINIMUM_STARS_FOR_HIGHLIGHT: int({
      default: DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT,
    }),
    MONTHS_INTERVAL: int({ default: DEFAULT_MONTHS_INTERVAL }),
  });
  const config: Config = {
    contributionsGetterConfig: {
      monthsInterval: env.MONTHS_INTERVAL,
    },
    headerFormat: env.HEADER_FORMAT,
    highlightFormat: env.HIGHLIGHT_FORMAT,
    fileBefore: env.FILE_BEFORE,
    fileAfter: env.FILE_AFTER,
    minimumStarsForHighlight: env.MINIMUM_STARS_FOR_HIGHLIGHT,
    getContributionsFn,
  };
  const markdown = await getContributionsMarkdown(
    env.GITHUB_TOKEN,
    env.GITHUB_USERNAME,
    config
  );
  return markdown;
};
