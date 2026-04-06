# Frontend Runtime

This file is a compatibility entry point. The canonical runtime requirements now
live in `openspec/specs/frontend-runtime/spec.md`.

## OpenSpec Capability

- `frontend-runtime`

## Quick Reference

- required browser-exposed runtime variables now include `VITE_APP_ENV`,
  `VITE_APP_RELEASE`, `VITE_API_BASE_URL`, and
  `VITE_CLERK_PUBLISHABLE_KEY`
- `.env.example` also keeps the current optional Clerk route placeholders plus
  the browser-safe observability toggles `VITE_OBSERVABILITY_ENABLED` and
  `VITE_OBSERVABILITY_ENDPOINT`
- the routed frontend baseline treats `/` as the protected app-shell home and
  keeps `/sign-in` and `/sign-up` as explicit auth-entry routes that host the
  real Clerk SPA flow
- `frontend-web` now initializes one shared browser observability runtime from
  `@mpa-forge/platform-frontend-observability` through app-owned bootstrap
  modules in `src/app`
- authenticated route transitions are tracked from one router-owned tracker
  instead of feature-page telemetry hooks
- browser errors, unhandled promise rejections, and Web Vitals are captured
  once from the shared app bootstrap
- protected generated API calls now flow through one shared
  `@mpa-forge/platform-contracts-client` transport that resolves
  `VITE_API_BASE_URL`, injects the Clerk bearer token, adds frontend
  correlation headers, and classifies protected API failures for the UI
- the frontend bootstraps one root TanStack Query provider and uses shared
  query-key ownership plus the standard `EnsureCurrentUserProfile` then
  `GetCurrentUser` sequence for the protected current-user flow
- the source layout baseline keeps app bootstrap and shell modules in
  `src/app`, route modules in `src/routes`, feature-owned code in
  `src/features/<feature>`, shared UI in `src/ui`, shared API infrastructure in
  `src/api`, and app-wide Zustand stores in `src/stores`
- the app shell reports the configured environment, API base URL, and whether
  the publishable key is present
- shared observability user context follows frontend auth state instead of
  relying on feature-owned telemetry wiring
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
