## MODIFIED Requirements

### Requirement: Local run uses the fixed preview port and health asset

The repository SHALL provide `make run` through a Bun-backed run script, and
that flow MUST build the app and serve the preview on `127.0.0.1:3000` with
strict port enforcement. The built frontend MUST also expose the static
`public/healthz` asset at `/healthz`.

#### Scenario: Local preview serves the frontend on the documented port

- **WHEN** a developer runs `make run` from the repository root
- **THEN** the built frontend preview starts on `127.0.0.1:3000` without
  choosing a fallback port

#### Scenario: Health asset remains reachable in local preview

- **WHEN** the local preview server is running
- **THEN** `GET /healthz` returns the committed static health payload
