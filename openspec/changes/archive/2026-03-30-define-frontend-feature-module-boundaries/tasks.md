## 1. Baseline Layout

- [x] 1.1 Restructure the frontend source tree so app bootstrap and shell modules, route modules, shared UI, shared API infrastructure, feature folders, and app-wide stores each have a clear baseline home under `src/`.
- [x] 1.2 Add the minimal embodied shared UI location and ownership boundaries needed so the repo tree itself communicates what is app-wide versus feature-scoped.

## 2. Current-User Feature Placement

- [x] 2.1 Move the protected current-user page and any feature-owned helpers or API wrappers into the `src/features/current-user/` module layout while keeping shared generated-client and TanStack Query infrastructure in shared areas.
- [x] 2.2 Update the route-owned layer so it imports the current-user feature from the new layout and keeps path, auth-boundary, and shell composition concerns in route modules.

## 3. Documentation Sync

- [x] 3.1 Update the relevant frontend docs and repo guidance to document the baseline folder layout and the rule for promoting code from feature-local to shared modules.
- [x] 3.2 Confirm the module-boundary guidance covers route modules, shared UI, stores, and API-facing code without redefining the behavior conventions already owned by the routing and data-fetching specs.

## 4. Validation And Archive

- [x] 4.1 Run the repo-local validation commands for the restructured frontend flow, including lint, tests, and any build check needed for touched runtime code.
- [x] 4.2 Archive or sync the completed change back into canonical OpenSpec specs after the implementation is verified.
