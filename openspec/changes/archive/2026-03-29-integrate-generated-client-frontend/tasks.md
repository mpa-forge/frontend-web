## 1. Generated client wiring

- [x] 1.1 Add the frontend dependencies and local package wiring needed to
      consume `@mpa-forge/platform-contracts-client` through Bun
- [x] 1.2 Add repo-local GitHub Packages consumer auth configuration and
      bootstrap docs for future frontend repos forked from this baseline
- [x] 1.3 Create a repo-local generated-client adapter that constructs the
      browser transport from `VITE_API_BASE_URL` and injects Clerk bearer tokens

## 2. Protected profile flow

- [x] 2.1 Implement the protected current-user profile calls using
      `EnsureCurrentUserProfile` and `GetCurrentUser`
- [x] 2.2 Update the app shell to render loading, unauthenticated, API-error,
      and successful profile states for the protected flow

## 3. Validation and sync

- [x] 3.1 Add or update frontend tests so the generated protected-client flow is
      covered by the repo-local test baseline
- [x] 3.2 Run the strongest repo-local validation for the change and archive the
      OpenSpec change after the implementation is complete
