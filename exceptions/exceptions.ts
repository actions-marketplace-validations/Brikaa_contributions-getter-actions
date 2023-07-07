export class MissingEnvironmentVariablesExceptions extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingEnvironmentVariablesExceptions";
  }
}
