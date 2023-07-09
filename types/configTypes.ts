import {
  Contribution,
  Config as ContributionsGetterConfig,
  getContributions,
} from "contributions-getter";

export type GetContributionsType = (
  ...args: Parameters<typeof getContributions>
) => Promise<Contribution[]>;

export interface Config {
  contributionsGetterConfig?: ContributionsGetterConfig;
  headerFormat?: string;
  highlightFormat?: string;
  fileBefore?: string;
  fileAfter?: string;
  minimumStarsForHighlight?: number;
  getContributionsFn?: GetContributionsType;
}
