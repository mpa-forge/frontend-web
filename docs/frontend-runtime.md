# Frontend Runtime

This file is a compatibility entry point. The canonical runtime requirements now
live in `openspec/specs/frontend-runtime/spec.md`.

## OpenSpec Capability

- `frontend-runtime`

## Quick Reference

- required browser-exposed runtime variables are `VITE_APP_ENV`,
  `VITE_APP_RELEASE`, `VITE_API_BASE_URL`, and
  `VITE_CLERK_PUBLISHABLE_KEY`
- `.env.example` also keeps the current optional Clerk route placeholders plus
  browser-safe observability values for the shared frontend observability
  package
- the routed frontend baseline treats `/` as the protected app-shell home and
  keeps `/sign-in` and `/sign-up` as explicit auth-entry routes that host the
  real Clerk SPA flow
- protected generated API calls now flow through one shared
  `@mpa-forge/platform-contracts-client` transport that resolves
  `VITE_API_BASE_URL`, injects the Clerk bearer token, attaches shared
  frontend observability correlation headers, and classifies protected API
  failures for the UI
- the frontend now initializes browser observability through
  `@mpa-forge/platform-frontend-observability`, keeping Grafana Faro setup
  inside the shared package while `frontend-web` provides only browser-safe
  app and ingest config
- route-driven page views, auth-driven user context, global browser errors, and
  Web Vitals are wired through the shared observability package instead of
  bespoke page-level telemetry code
- the frontend bootstraps one root TanStack Query provider and uses shared
  query-key ownership plus the standard `EnsureCurrentUserProfile` then
  `GetCurrentUser` sequence for the protected current-user flow
- the source layout baseline keeps app bootstrap and shell modules in
  `src/app`, route modules in `src/routes`, feature-owned code in
  `src/features/<feature>`, shared UI in `src/ui`, shared API infrastructure in
  `src/api`, and app-wide Zustand stores in `src/stores`
- the app shell reports the configured environment, API base URL, and whether
  the publishable key is present
- the protected route gate distinguishes auth-loading, auth-unavailable, and
  unauthenticated redirect behavior before protected content renders
- the auth-entry routes preserve one safe `redirectTo` target, short-circuit
  signed-in sessions back into the protected branch, and keep a route-local
  unavailable state when Clerk config is missing
- missing required runtime variables are surfaced in a dedicated "Missing
  configuration" section
- `make run` uses the Bun-backed run script, builds the app, and serves the
  preview on `127.0.0.1:3000`
- the built frontend keeps the static `/healthz` endpoint from `public/healthz`

## Update Rule

When frontend runtime behavior changes, update the OpenSpec capability first and
keep this file as a lightweight reader-friendly summary. For source-layout
ownership guidance, use `docs/frontend-module-boundaries.md`.
