import { getContributions } from "contributions-getter";
import { Config } from "./types/configTypes";
import {
  COMMITS_URL_SYMBOL,
  DEFAULT_HEADER_FORMAT,
  DEFAULT_HIGHLIGHT_FORMAT,
  HEADER_SYMBOL,
  NO_COMMITS_SYMBOL,
  PRIMARY_LANGUAGE_SYMBOL,
  REPO_DESCRIPTION_SYMBOL,
  REPO_NAME_SYMBOL,
  REPO_URL_SYMBOL,
} from "./constants/formatConstants";
import { TOKEN_ENV, USERNAME_ENV } from "./constants/envConstants";
import { MissingEnvironmentVariablesExceptions } from "./exceptions/exceptions";
import { Environment } from "./types/envTypes";

const getContributionsMarkdown = async (
  token: string,
  userName: string,
  config: Config = {}
) => {
  const {
    contributionsGetterConfig = {},
    fileAfter,
    fileBefore,
    headerFormat = DEFAULT_HEADER_FORMAT,
    highlightFormat = DEFAULT_HIGHLIGHT_FORMAT,
    minimumStarsForHighlight = 1000,
  } = config;

  const contributionsYears = await getContributions(
    token,
    userName,
    contributionsGetterConfig
  );
  const markdown: string[] = [];

  contributionsYears.forEach((cy) => {
    markdown.push(`## ${cy.startDate} - ${cy.endDate}\n\n<details>\n`);
    cy.repos.forEach((r) => {
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

      markdown.push(`### ${highlighted}\n`);
    });
    markdown.push(`</details>\n`);
  });

  return markdown.join("\n");
};

const getEnvironment = (env: NodeJS.ProcessEnv): Environment => {
  for (const variable of [TOKEN_ENV, USERNAME_ENV]) {
    if (env[variable] === undefined)
      throw new MissingEnvironmentVariablesExceptions(
        `Environment variable ${variable} is missing`
      );
  }
  return {
    token: env[TOKEN_ENV]!,
    username: env[USERNAME_ENV]!,
  };
};

(async () => {
  const env = getEnvironment(process.env);
  const markdown = await getContributionsMarkdown(env.token, env.username);
  console.log(markdown);
})();
