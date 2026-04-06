## Why

`frontend-web` now has a shared frontend observability package available, but
the authenticated SPA still boots without browser telemetry, route-level
tracking, or request-correlation wiring. We need to lock in that integration
now so the first protected flow emits consistent frontend signals and later
features do not invent bespoke observability hooks.

## What Changes

- Add a frontend observability integration capability that defines one shared
  browser bootstrap path for telemetry initialization, route tracking,
  client-side error capture, Web Vitals emission, and auth-driven user-context
  updates through `@mpa-forge/platform-frontend-observability`.
- Extend the frontend runtime contract so `.env.example` and runtime validation
  document the browser-safe observability variables needed to enable the shared
  package without embedding provider secrets in the repo.
- Extend the shared protected generated-client transport so protected API calls
  attach frontend-to-backend correlation headers from the observability runtime
  alongside the existing Clerk bearer token flow.
- Make the current protected user-profile route the first baseline validation
  path for correlated frontend telemetry instead of adding observability wiring
  directly inside feature page components.

## Capabilities

### New Capabilities

- `frontend-observability-integration`: shared browser observability bootstrap,
  route tracking, error/Web Vitals emission, auth-user-context sync, and one
  protected-flow correlation contract for `frontend-web`

### Modified Capabilities

- `frontend-runtime`: expand the browser runtime contract to document the
  browser-safe observability variables consumed by the shared frontend package
- `frontend-generated-client-integration`: require protected generated-client
  requests to attach observability correlation headers through the shared
  transport path instead of feature-local request code

## Impact

- Affects frontend bootstrap, shared providers, router-owned tracking, auth
  context bridging, and the protected generated-client transport in
  `frontend-web`
- Adds a new shared dependency on
  `@mpa-forge/platform-frontend-observability`
- Updates the browser-exposed runtime contract and the protected request
  contract, while keeping observability secrets out of frontend code and
  committed env files
