import { Repository } from "contributions-getter";

export const sortByStars = (r1: Repository, r2: Repository) =>
  r2.stars - r1.stars;

export const sortByCommits = (r1: Repository, r2: Repository) =>
  r2.commits - r1.commits;
