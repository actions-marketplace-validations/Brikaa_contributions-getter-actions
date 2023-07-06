import { Config as ContributionsGetterConfig } from "contributions-getter";

export interface Config {
  contributionsGetterConfig?: ContributionsGetterConfig;
  headerFormat?: string;
  highlightFormat?: string;
  fileBefore?: string;
  fileAfter?: string;
  minimumStarsForHighlight?: number;
}
