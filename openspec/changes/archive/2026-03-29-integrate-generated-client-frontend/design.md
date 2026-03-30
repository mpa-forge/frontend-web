## Context

`frontend-web` currently proves the runtime and local-stack baseline, but it
does not yet exercise the authenticated API path defined in `platform-contracts`
and `backend-api`. `P2-T10` requires the frontend to consume the generated
TypeScript client package, send Clerk bearer tokens to the protected
`UserService` procedures, and render the first authenticated profile flow
without introducing hand-written request or response DTOs.

The current app is a small runtime-status shell with no generated API client
adapter, no protected frontend view, and no frontend-side token acquisition
integration. The backend contract and auth semantics are already defined in
`platform-contracts` and `backend-api`, so this change should stay focused on
frontend consumption rather than redefining API behavior.

## Goals / Non-Goals

**Goals:**

- Add a reusable frontend integration point for
  `@mpa-forge/platform-contracts-client`.
- Add a durable package-consumer bootstrap path for published `@mpa-forge/*`
  packages that works with Bun and does not require committed credentials.
- Use the generated `UserService` client for the first protected profile flow.
- Send Clerk bearer tokens on protected API calls using the direct SPA token
  model already locked for the platform.
- Render clear frontend states for loading, unauthenticated access, successful
  profile reads, and protected API failures.
- Add focused tests that cover the generated protected-client flow.

**Non-Goals:**

- Full frontend route-map or module-boundary redesign.
- Broad TanStack Query rollout across the app.
- Changes to backend contract definitions or backend auth semantics.
- Replacing the current runtime-status shell with a full product UI.

## Decisions

### Use a repo-local generated-client adapter instead of calling generated APIs directly from components

The frontend will wrap generated Connect client construction in a small
repo-local adapter module. That keeps transport creation, base URL selection,
and auth-header injection out of presentational components.

Alternatives considered:

- Call generated client construction inline inside React components.
  Rejected because it spreads transport and auth concerns across the UI.
- Add a large API abstraction layer before the first protected flow exists.
  Rejected because it adds indirection before there is enough frontend API
  surface to justify it.

### Use package-name imports only for contract consumption

Frontend code will import generated services and message types from
`@mpa-forge/platform-contracts-client`, not from sibling-repo file paths. That
keeps application imports stable whether the dependency comes from a workspace
link or GitHub Packages.

Alternatives considered:

- Import directly from generated files in `../platform-contracts`.
  Rejected because it would couple app code to the workspace layout and make
  later package publication a breaking frontend refactor.

### Use committed scoped-registry config with environment-provided auth

The repo will commit the `@mpa-forge` GitHub Packages registry mapping in
`.npmrc` and require the package-read token through the
`GITHUB_PACKAGES_TOKEN` environment variable. This keeps the install path stable
for Bun-based consumers while keeping credentials out of the repository.

Alternatives considered:

- Require every developer to hand-author a user-level `.npmrc`.
  Rejected because it makes frontend bootstrap less repeatable and easy to miss
  in future repos forked from this one.
- Commit a real token or repo-local credentials file.
  Rejected because secrets must not live in source control.

### Model token acquisition as an async provider boundary

The generated-client adapter will depend on an async token-provider function
instead of hard-coding token lookups inside every request call. The initial
implementation can use Clerk for session-token retrieval while keeping the
transport wiring reusable and testable.

Alternatives considered:

- Read Clerk token state directly in every component before each call.
  Rejected because it duplicates auth behavior and makes testing harder.
- Store bearer tokens manually in local app state.
  Rejected because the platform baseline is direct SPA token retrieval from the
  auth provider, not ad hoc token storage logic.

### Keep the first protected flow minimal and centered on the current user profile

The first authenticated frontend proof will call
`EnsureCurrentUserProfile` and `GetCurrentUser`, then render the resulting user
profile or a clear failure state. This keeps the first typed integration aligned
to the existing backend contract and Phase 2 proof requirements.

Alternatives considered:

- Introduce a broader dashboard or multi-page feature flow immediately.
  Rejected because it expands scope beyond the first authenticated proof.

## Risks / Trade-offs

- [Clerk frontend configuration is not fully wired yet] -> Keep token retrieval
  behind a thin provider boundary so the generated-client integration can stay
  stable while the concrete Clerk setup is completed.
- [The first protected flow may pressure the current single-shell app structure]
  -> Keep the UI scope small and avoid mixing this change with the broader route
  and module-boundary work planned after `P2-T10`.
- [Auth and API errors can be hard to interpret in the browser] -> Normalize the
  protected flow into explicit unauthenticated, loading, API-error, and success
  states rather than surfacing raw request failures directly.
- [Workspace-local dependency use may drift from published package use] -> Keep
  package-name imports stable and confine source-selection details to dependency
  configuration instead of application code.
- [GitHub Packages auth can fail during bootstrap] -> Commit the scoped registry
  mapping in the repo, document the `GITHUB_PACKAGES_TOKEN` requirement, and
  keep the token source external to the repository.
