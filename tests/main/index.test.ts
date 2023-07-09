import "dotenv/config";
import {
  COMMITS_URL_SYMBOL,
  HEADER_SYMBOL,
  NO_COMMITS_SYMBOL,
  PRIMARY_LANGUAGE_SYMBOL,
  REPO_DESCRIPTION_SYMBOL,
  REPO_NAME_SYMBOL,
  REPO_URL_SYMBOL,
} from "../../main/constants";
import { expect, jest } from "@jest/globals";
import { Contribution } from "contributions-getter";
import { getContributionsMarkdownUsingEnvConfig } from "../../main/getContributionsMarkdown";
import { GetContributionsType } from "../../types/configTypes";
import path from "path";

type Environment = { [key: string]: string };
const MONTHS_INTERVAL = "11";
const MINIMUM_STARS_FOR_HIGHLIGHT = "500";
const HEADER_FORMAT = `[${NO_COMMITS_SYMBOL}](${COMMITS_URL_SYMBOL}) in [${REPO_NAME_SYMBOL}](${REPO_URL_SYMBOL}) using\
${PRIMARY_LANGUAGE_SYMBOL}\n${REPO_DESCRIPTION_SYMBOL}`;
const HIGHLIGHT_FORMAT = `[COOL] ${HEADER_SYMBOL}`;
const FILE_BEFORE = path.join(__dirname, "before.md");
const FILE_AFTER = path.join(__dirname, "after.md");

/*
Combinations
- Single year, HEADER_FORMAT: default, HIGHLIGHT_FORMAT: default, FILE_BEFORE: default, FILE_AFTER: default,
  MINIMUM_STARS_FOR_HIGHLIGHT: default, MONTHS_INTERVAL: default
- Multiple years, HEADER_FORMAT: default, HIGHLIGHT_FORMAT: modified, FILE_BEFORE: default, FILE_AFTER: modified,
  MINIMUM_STARS_FOR_HIGHLIGHT: modified, MONTHS_INTERVAL: modified
- Multiple years, HEADER_FORMAT: modified, HIGHLIGHT_FORMAT: default, FILE_BEFORE: modified, FILE_AFTER: default,
  MINIMUM_STARS_FOR_HIGHLIGHT: default, MONTHS_INTERVAL: default
- Multiple years, HEADER_FORMAT: modified, HIGHLIGHT_FORMAT: modified, FILE_BEFORE: modified, FILE_AFTER: modified,
  MINIMUM_STARS_FOR_HIGHLIGHT: default, MONTHS_INTERVAL: default
- Empty, first
*/
const COMBINATIONS: Environment[] = [
  {},
  {
    HIGHLIGHT_FORMAT,
    FILE_AFTER,
    MINIMUM_STARS_FOR_HIGHLIGHT,
    MONTHS_INTERVAL,
  },
  {
    HEADER_FORMAT,
    FILE_BEFORE,
  },
  {
    HEADER_FORMAT,
    HIGHLIGHT_FORMAT,
    FILE_AFTER,
    FILE_BEFORE,
  },
];

const assignEnv = (env: Environment) => {
  process.env = { ...process.env, ...env };
};

const FIRST_YEAR_CONTRIBUTION: Contribution = {
  startDate: new Date("2019-07-08T18:19:55.477Z"),
  endDate: new Date("2020-07-08T18:19:55.477Z"),
  repos: [
    {
      name: "First repo",
      description: "It's a cool repo",
      commits: 123,
      commitsUrl: "https://www.youtube.com",
      isPrivate: false,
      primaryLanguage: "Python",
      stars: 33,
      url: "https://www.google.com",
    },
    {
      name: "second-repo",
      description: null,
      commits: 1,
      commitsUrl: "https://github.com",
      isPrivate: false,
      primaryLanguage: null,
      stars: 3000,
      url: "https://www.fast.com",
    },
  ],
};

const SECOND_YEAR_CONTRIBUTION: Contribution = {
  startDate: new Date("2020-07-08T18:19:55.477Z"),
  endDate: new Date("2021-07-08T18:19:55.477Z"),
  repos: [],
};

const THIRD_YEAR_CONTRIBUTION: Contribution = {
  startDate: new Date("2021-07-08T18:19:55.477Z"),
  endDate: new Date("2022-07-08T18:19:55.477Z"),
  repos: [
    {
      name: "third-repo",
      description: "It's a repo",
      commits: 450,
      commitsUrl: "https://www.github.com/new",
      isPrivate: true,
      primaryLanguage: "Java",
      stars: 550,
      url: "https://www.github.com/brikaa",
    },
    {
      name: "fourth-repo",
      description: null,
      commits: 600,
      commitsUrl: "https://www.github.com/microsoft",
      isPrivate: false,
      primaryLanguage: null,
      stars: 300,
      url: "https://www.github.com/microsoft/vscode",
    },
  ],
};

const createMockGetContributions = (
  returnValue: Contribution[]
): GetContributionsType =>
  jest.fn<GetContributionsType>().mockResolvedValue(returnValue);

/*
- One empty
- One single year
- One multiple years with empty periods, non private repos
*/
const emptyGetContributions = createMockGetContributions([]);
const singleYearGetContributions = createMockGetContributions([
  FIRST_YEAR_CONTRIBUTION,
]);
const multipleYearsGetContributions = createMockGetContributions([
  FIRST_YEAR_CONTRIBUTION,
  SECOND_YEAR_CONTRIBUTION,
  THIRD_YEAR_CONTRIBUTION,
]);

const FIRST_EXPECTED_MARKDOWN = `## Mon Jul 08 2019 - Wed Jul 08 2020

<details>

### [First repo](https://www.google.com) - [123 commits](https://www.youtube.com) - Python
It's a cool repo

### ⭐ [second-repo](https://www.fast.com) - [1 commit](https://github.com) - No primary language
No description

</details>`;

const SECOND_EXPECTED_MARKDOWN = `## Mon Jul 08 2019 - Wed Jul 08 2020

<details>

### [First repo](https://www.google.com) - [123 commits](https://www.youtube.com) - Python
It's a cool repo

### [COOL] [second-repo](https://www.fast.com) - [1 commit](https://github.com) - No primary language
No description

</details>

## Thu Jul 08 2021 - Fri Jul 08 2022

<details>

### [fourth-repo](https://www.github.com/microsoft/vscode) - [600 commits](https://www.github.com/microsoft) - No primary language
No description

</details>

Generated by [brikaa/contributions-getter-actions](https://www.google.com)
`;

const testAgainstCombination = async (
  getContributionsFn: GetContributionsType,
  combinationNumber: number,
  expectedMarkdown: string
) => {
  assignEnv(COMBINATIONS[combinationNumber]);
  const markdown = await getContributionsMarkdownUsingEnvConfig(
    getContributionsFn
  );
  expect(markdown).toBe(expectedMarkdown);
};
describe("Full path till returning the markdown", () => {
  it("returns correct markdown with first combination", async () => {
    testAgainstCombination(
      singleYearGetContributions,
      0,
      FIRST_EXPECTED_MARKDOWN
    );
  });

  it("returns correct markdown with second combination", async () => {
    testAgainstCombination(
      multipleYearsGetContributions,
      1,
      SECOND_EXPECTED_MARKDOWN
    );
  });
});
