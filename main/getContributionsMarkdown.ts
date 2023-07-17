import { Config } from "contributions-getter";
import {
  COMMITS_URL_SYMBOL,
  DEFAULT_HEADER_FORMAT,
  DEFAULT_HIGHLIGHT_FORMAT,
  DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT,
  MOCK_GET_CONTRIBUTIONS_FN_TYPES,
  HEADER_SYMBOL,
  NO_COMMITS_SYMBOL,
  PRIMARY_LANGUAGE_SYMBOL,
  REPO_DESCRIPTION_SYMBOL,
  REPO_NAME_SYMBOL,
  REPO_URL_SYMBOL,
  SORT_REPOS_FN_TYPES,
  DEFAULT_SORT_REPOS_FN,
  DEFAULT_MOCK_GET_CONTRIBUTIONS_FN,
} from "./constants";
import { Environment } from "./types";
import { readFileSync } from "fs";
import { cleanEnv, makeValidator, str } from "envalid";
import { formatDate } from "./util";
import {
  emptyGetContributions,
  multipleYearsGetContributions,
  singleYearGetContributions,
} from "../functions/getContributionsFunctions";
import { sortByCommits, sortByStars } from "../functions/sortReposFunctions";

const getContributionsMarkdown = async (env: Environment) => {
  const {
    TOKEN,
    USERNAME,
    MONTHS_INTERVAL,
    FILE_BEFORE_PATH,
    FILE_AFTER_PATH,
    HEADER_FORMAT,
    HIGHLIGHT_FORMAT,
    MINIMUM_STARS_FOR_HIGHLIGHT,
    SORT_REPOS_FN,
    MOCK_GET_CONTRIBUTIONS_FN: getContributionsFn,
  } = env;

  const markdown: string[] = [];
  if (FILE_BEFORE_PATH !== undefined)
    markdown.push(readFileSync(FILE_BEFORE_PATH).toString());

  // Need to read the afterFile early in order to fail on error without wasting API quota
  const contentAfter =
    FILE_AFTER_PATH === undefined
      ? null
      : readFileSync(FILE_AFTER_PATH).toString();

  const config: Config | undefined =
    MONTHS_INTERVAL === undefined
      ? undefined
      : { monthsInterval: MONTHS_INTERVAL };
  const contributionsInterval = await getContributionsFn(
    TOKEN,
    USERNAME,
    config,
  );

  contributionsInterval
    .filter((ci) => ci.repos.length > 0)
    .forEach((ci) => {
      markdown.push(
        `## ${formatDate(ci.startDate)} -> ${formatDate(
          ci.endDate,
        )}\n\n<details>\n`,
      );
      ci.repos
        .filter((r) => !r.isPrivate)
        .sort(SORT_REPOS_FN)
        .forEach((r) => {
          const header = HEADER_FORMAT.replace(REPO_NAME_SYMBOL, r.name)
            .replace(REPO_URL_SYMBOL, r.url)
            .replace(
              NO_COMMITS_SYMBOL,
              r.commits.toString() + (r.commits === 1 ? " commit" : " commits"),
            )
            .replace(COMMITS_URL_SYMBOL, r.commitsUrl)
            .replace(
              PRIMARY_LANGUAGE_SYMBOL,
              r.primaryLanguage ?? "no primary language",
            )
            .replace(
              REPO_DESCRIPTION_SYMBOL,
              r.description ?? "no description",
            );

          const highlighted =
            r.stars >= MINIMUM_STARS_FOR_HIGHLIGHT
              ? HIGHLIGHT_FORMAT.replace(HEADER_SYMBOL, header)
              : header;

          markdown.push(`### ${highlighted}\n`);
        });
      markdown.push(`</details>`);
      markdown.push("");
    });

  markdown.pop();
  if (contentAfter !== null) markdown.push(contentAfter);
  return markdown.join("\n");
};

export const getContributionsMarkdownUsingEnvConfig = async () => {
  const int = makeValidator((x) => {
    const xInt = parseInt(x);
    if (isNaN(xInt)) throw new Error("Expected a number");
    else return xInt;
  });

  const buildValidValueValidator = <T, V extends string>(
    envName: string,
    allowedStrings: readonly V[],
    nameValueMap: { [name in (typeof allowedStrings)[number]]: T },
  ) =>
    makeValidator((givenString) => {
      const chosenString = allowedStrings.find((s) => s === givenString);
      if (chosenString === undefined) throw new Error(`Invalid ${envName}`);
      return nameValueMap[chosenString];
    });

  const env = cleanEnv<Environment>(process.env, {
    TOKEN: str(),
    USERNAME: str(),
    FILE_AFTER_PATH: str({ default: undefined }),
    FILE_BEFORE_PATH: str({ default: undefined }),
    HEADER_FORMAT: str({ default: DEFAULT_HEADER_FORMAT }),
    HIGHLIGHT_FORMAT: str({ default: DEFAULT_HIGHLIGHT_FORMAT }),
    MINIMUM_STARS_FOR_HIGHLIGHT: int({
      default: DEFAULT_MINIMUM_STARS_FOR_HIGHLIGHT,
    }),
    MONTHS_INTERVAL: int({ default: undefined }),
    SORT_REPOS_FN: buildValidValueValidator(
      "SORT_REPOS_FN",
      SORT_REPOS_FN_TYPES,
      {
        COMMITS: sortByCommits,
        STARS: sortByStars,
      },
    )({ default: DEFAULT_SORT_REPOS_FN }),
    MOCK_GET_CONTRIBUTIONS_FN: buildValidValueValidator(
      "MOCK_GET_CONTRIBUTIONS_FN",
      MOCK_GET_CONTRIBUTIONS_FN_TYPES,
      {
        EMPTY: emptyGetContributions,
        MULTIPLE: multipleYearsGetContributions,
        SINGLE: singleYearGetContributions,
      },
    )({ default: DEFAULT_MOCK_GET_CONTRIBUTIONS_FN }),
  });

  const markdown = await getContributionsMarkdown(env);
  return markdown;
};
