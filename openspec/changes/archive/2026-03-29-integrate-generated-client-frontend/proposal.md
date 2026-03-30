## Why

`P2-T10` requires `frontend-web` to stop describing the protected API path only
as documentation and instead prove it in running frontend code. The repo needs a
typed frontend integration that consumes the generated `platform-contracts`
package, sends Clerk bearer tokens to `backend-api`, and renders the first
authenticated profile flow without hand-written DTO drift.

## What Changes

- Add a reusable frontend integration path for the generated
  `@mpa-forge/platform-contracts-client` package, including Connect transport
  creation, client construction, and bearer-token injection for protected API
  calls.
- Add repo-local GitHub Packages consumer configuration and bootstrap
  documentation so `frontend-web` and future frontend repos forked from this
  baseline can install published `@mpa-forge/*` packages through Bun without
  committing credentials.
- Add the first authenticated frontend flow that provisions or reads the current
  user profile through the generated `UserService` client and renders the result
  in the app.
- Add the minimum frontend auth-state handling needed to distinguish loading,
  unauthenticated, successful, and API-error states for the protected profile
  flow.
- Add or update frontend tests so the typed protected flow is validated through
  repo-local unit/component coverage.

## Capabilities

### New Capabilities

- `frontend-generated-client-integration`: Covers the reusable frontend pattern
  for consuming generated Connect clients from `platform-contracts` with
  environment-based API base URL and Clerk bearer-token auth.
- `frontend-protected-user-profile`: Covers the minimum authenticated frontend
  page or app state that calls the protected `UserService` procedures and
  renders the current user profile flow.

### Modified Capabilities

- `frontend-testing`: Expand the testing baseline to require coverage for the
  generated protected-client flow instead of only the static shell smoke path.

## Impact

- Affected code: `frontend-web` app shell, new API client wiring, auth-aware UI
  state, and related tests.
- Affected dependencies: generated `platform-contracts` TypeScript client
  package and browser Connect transport dependencies.
- Affected bootstrap flow: local and CI package installs that need read access
  to GitHub Packages.
- Affected systems: `backend-api` protected `UserService` endpoints and Clerk
  bearer-token flow consumed from the browser.
