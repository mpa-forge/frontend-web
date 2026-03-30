# Frontend Package Consumer Auth

This repo commits scoped registry configuration in `.npmrc` so Bun and npm know
that `@mpa-forge/*` packages are installed from GitHub Packages
(`https://npm.pkg.github.com`).

Secrets are not committed. Consumer auth is provided through the
`GITHUB_PACKAGES_TOKEN` environment variable at install time.

## Local Bootstrap

For local installs in PowerShell:

```powershell
$env:GITHUB_PACKAGES_TOKEN = (gh auth token).Trim()
bun install
```

Requirements:

- the GitHub CLI account or personal access token must include `read:packages`
- the token must be able to read packages for the `mpa-forge` owner

Alternative:

- export `GITHUB_PACKAGES_TOKEN` from a dedicated token instead of using
  `gh auth token`

## Future Frontend Repos Forked From This One

When a future frontend repo forks or copies this bootstrap:

1. keep the committed `.npmrc` scoped-registry mapping
2. keep package imports pointed at published package names such as
   `@mpa-forge/platform-contracts-client`
3. document the `GITHUB_PACKAGES_TOKEN` bootstrap step in the new repo README
4. do not commit package tokens to the repo, `.env`, or repo-local config files

## CI Or Automation

For CI or automation:

- provide `GITHUB_PACKAGES_TOKEN` as a secret or environment variable
- run Bun normally; the committed `.npmrc` will use that token automatically

## Why This Exists

The shared contracts client is published to GitHub Packages. Keeping the scope
mapping in the repo and the token outside the repo gives frontend consumers a
repeatable install path without baking credentials into source control.
