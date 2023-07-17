import { Config, ContributionsInterval } from "contributions-getter";
import { GetContributions } from "../types/configTypes";

const createRepoHeader = (username: string, config?: Config) =>
  `${username}-${
    config?.monthsInterval === undefined ? "12" : config.monthsInterval
  }`;

const firstYearContributions = (
  _token: string,
  username: string,
  config?: Config,
): ContributionsInterval => ({
  startDate: new Date("2019-07-10T18:19:55.477Z"),
  endDate: new Date("2020-07-10T18:19:55.477Z"),
  repos: [
    {
      name: createRepoHeader(username, config),
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
});

const secondYearContributions = (): ContributionsInterval => ({
  startDate: new Date("2020-07-10T18:19:55.477Z"),
  endDate: new Date("2021-07-10T18:19:55.477Z"),
  repos: [],
});

const thirdYearContributions = (
  _token: string,
  username: string,
  config?: Config,
): ContributionsInterval => ({
  startDate: new Date("2021-07-10T18:19:55.477Z"),
  endDate: new Date("2022-07-10T18:19:55.477Z"),
  repos: [
    {
      name: createRepoHeader(username, config),
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
      stars: 520,
      url: "https://www.github.com/microsoft/vscode",
    },
  ],
});

const createMockGetContributions =
  (
    contributionsIntervalBuilder: ((
      ...args: Parameters<GetContributions>
    ) => ContributionsInterval)[],
  ): GetContributions =>
  async (...args: Parameters<GetContributions>) =>
    contributionsIntervalBuilder.map((b) => b(...args));

export const emptyGetContributions = createMockGetContributions([]);
export const singleYearGetContributions = createMockGetContributions([
  firstYearContributions,
]);
export const multipleYearsGetContributions = createMockGetContributions([
  firstYearContributions,
  secondYearContributions,
  thirdYearContributions,
]);
