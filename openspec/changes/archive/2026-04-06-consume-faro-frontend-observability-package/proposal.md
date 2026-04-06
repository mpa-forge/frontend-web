## Why

`P3-T03B` now targets the shared package's Faro-backed wrapper contract rather than the earlier custom browser-event emitter approach. `frontend-web` needs a new integration proposal so the app shell adopts the package's current runtime, React, React Router, and `frontend-web` helper entrypoints without reintroducing provider-specific wiring in app code.

## What Changes

- Add a `frontend-web` observability integration baseline that initializes the shared package once at app bootstrap and keeps page views, client-side errors, Web Vitals, and auth-driven user context flowing through package-owned helpers.
- Extend the frontend runtime env contract with the browser-safe observability inputs required by the shared package's Faro-backed wrapper.
- Update the protected generated-client boundary so shared request-correlation headers are attached through the package's `frontend-web` helper while preserving Clerk bearer-token injection.
- Document the provider-supported browser delivery path as the shared package ingest/Faro configuration contract rather than a custom `backend-api` ingest endpoint.

## Capabilities

### New Capabilities

- `frontend-observability-integration`: Covers app-bootstrap, router, auth-context, and protected-request integration with the shared frontend observability package.

### Modified Capabilities

- `frontend-runtime`: Expand the browser runtime contract to include the release and browser-safe observability config required for shared-package initialization.
- `frontend-generated-client-integration`: Require protected generated-client requests to attach shared frontend observability correlation metadata alongside Clerk bearer tokens.

## Impact

Affected areas include frontend bootstrap/providers, router wiring, auth context, protected generated-client transport, runtime env documentation, tests, and the published `@mpa-forge/platform-frontend-observability` package dependency.
