# Frontend Runtime

This file is a compatibility entry point. The canonical runtime requirements now
live in `openspec/specs/frontend-runtime/spec.md`.

## OpenSpec Capability

- `frontend-runtime`

## Quick Reference

- required browser-exposed runtime variables remain `VITE_APP_ENV`,
  `VITE_API_BASE_URL`, and `VITE_CLERK_PUBLISHABLE_KEY`
- `.env.example` also keeps the current optional Clerk route placeholders for
  local setup
- the routed frontend baseline treats `/` as the protected app-shell home and
  keeps `/sign-in` and `/sign-up` as explicit auth-entry routes
- the app shell reports the configured environment, API base URL, and whether
  the publishable key is present
- the protected route gate distinguishes auth-loading, auth-unavailable, and
  unauthenticated redirect behavior before protected content renders
- missing required runtime variables are surfaced in a dedicated "Missing
  configuration" section
- `make run` uses the Bun-backed run script, builds the app, and serves the
  preview on `127.0.0.1:3000`
- the built frontend keeps the static `/healthz` endpoint from `public/healthz`

## Update Rule

When frontend runtime behavior changes, update the OpenSpec capability first and
keep this file as a lightweight reader-friendly summary.
