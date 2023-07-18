# contributions-getter-actions

A highly configurable GitHub Action that updates a markdown file with the public repositories
a user has committed to since their GitHub account's creation.
It can be used to update your profile's README with the repositories you have committed to.

# Example

Check [example.md](./example.md)

# Configuration

The only required input to the GitHub Action is the GitHub token (`token`).
It is advisable be a token with no permissions.

Rest of the configuration documentation is TODO.
I need to automate updating the documentation so it does not go stale.
For now, [action.yml](./action.yml), [constants.ts](./main/constants.ts) can be of help.

## Configure how a repository is displayed

## Configure how a highly-starred repository is displayed

## Configure the number of months to show commits in

# Testing

```shell
npm install
npm test
```
