# frontend-runtime Specification

## Purpose

TBD - created by archiving change migrate-docs-to-openspec-specs. Update Purpose after archive.

## Requirements

### Requirement: Browser environment contract

The frontend runtime SHALL treat `VITE_APP_ENV`, `VITE_API_BASE_URL`, and
`VITE_CLERK_PUBLISHABLE_KEY` as required browser-exposed configuration. The
committed `.env.example` MUST document those required values together with the
optional Clerk route placeholders `VITE_CLERK_SIGN_IN_URL`,
`VITE_CLERK_SIGN_UP_URL`, `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, and
`VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`.

#### Scenario: `.env.example` documents the baseline runtime contract

- **WHEN** a developer opens the committed `.env.example`
- **THEN** the required frontend runtime variables and the optional Clerk route
  placeholders are listed as the local configuration template

### Requirement: App shell reports runtime status

The app shell SHALL render the current `VITE_APP_ENV`,
`VITE_API_BASE_URL`, and whether `VITE_CLERK_PUBLISHABLE_KEY` is present. If
one or more required runtime variables are missing, it MUST render a "Missing
configuration" section listing the missing keys.

#### Scenario: Runtime status reflects configured values

- **WHEN** the frontend is built with the required runtime variables present
- **THEN** the page shows the current environment, API base URL, and publishable
  key presence without listing missing required variables

#### Scenario: Missing required configuration is surfaced in the UI

- **WHEN** one or more required runtime variables are absent at build time
- **THEN** the page renders a "Missing configuration" section listing each
  missing required key

### Requirement: Local run uses the fixed preview port and health asset

The repository SHALL provide `make run` through the npm `run` script, and that
flow MUST build the app and serve the preview on `127.0.0.1:3000` with strict
port enforcement. The built frontend MUST also expose the static `public/healthz`
asset at `/healthz`.

#### Scenario: Local preview serves the frontend on the documented port

- **WHEN** a developer runs `make run` from the repository root
- **THEN** the built frontend preview starts on `127.0.0.1:3000` without
  choosing a fallback port

#### Scenario: Health asset remains reachable in local preview

- **WHEN** the local preview server is running
- **THEN** `GET /healthz` returns the committed static health payload
