const { relative, join } = require("path");

const cwd = process.argv[2];
const targetPath = process.argv[3];
const resultPath = join(cwd, targetPath);
const rel = relative(cwd, resultPath);
if (rel.startsWith("..")) {
  console.error(`${targetPath} tries to escape ${cwd}`);
  process.exit(1);
}
