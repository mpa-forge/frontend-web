## 1. Dependency And Runtime Contract

- [x] 1.1 Add `@mpa-forge/platform-frontend-observability` to the frontend dependencies and update local install/bootstrap notes for published-package consumption.
- [x] 1.2 Extend `.env.example`, runtime-store env parsing, and related docs/spec notes with the required release value plus the optional browser-safe observability config used by the shared package.

## 2. Shared Observability Bootstrap

- [x] 2.1 Add a thin app-owned observability bootstrap/runtime module that creates the shared runtime from `frontend-web` env values and app identity without importing Grafana Faro directly.
- [x] 2.2 Wrap the app tree with the shared package provider and add router-owned page-view tracking using the shared React and React Router helpers.
- [x] 2.3 Add auth-driven user-context synchronization plus global error and Web Vitals reporting through the shared runtime/package helpers.

## 3. Protected Request Correlation

- [x] 3.1 Extend the auth/provider boundary with the auth snapshot fields needed by the shared `frontend-web` helper contract.
- [x] 3.2 Update the shared protected generated-client transport to attach package-generated correlation headers alongside the Clerk bearer token.

## 4. Validation And Canonical Sync

- [x] 4.1 Add or update automated tests covering disabled/enabled bootstrap behavior, route tracking hooks or wrappers, auth-context synchronization, and protected request correlation.
- [x] 4.2 Refresh README/docs compatibility notes and sync the canonical OpenSpec specs that capture the final runtime, generated-client, and observability integration behavior.
- [x] 4.3 Run the repo validation suite for this change (`make lint`, `make test`, `make format-check`, and `bun run build`) and address any regressions before archiving.
