import { getContributionsMarkdownUsingEnvConfig } from "./getContributionsMarkdown";

(async () => {
  const markdown = await getContributionsMarkdownUsingEnvConfig();
  console.log(markdown);
})();
