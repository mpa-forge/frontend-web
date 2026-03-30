## Why

`frontend-web` now has a protected route baseline and shared generated-client/query
conventions, but feature code can still drift into inconsistent folder choices as
new routes and protected flows are added. We need to lock the initial
feature/module boundaries now so later work grows into a predictable source tree
instead of flattening `src/` and scattering route, store, and API-facing code.

## What Changes

- Define the baseline frontend source layout for route modules, feature folders,
  shared UI, shared app/bootstrap modules, client-side stores, and API-facing
  adapters.
- Document the promotion rules that keep single-feature code inside the feature
  folder and only move code into shared modules after it is truly reused across
  features or belongs to app-wide bootstrap concerns.
- Embody the boundary convention in the repo so the current protected
  current-user flow demonstrates where route-local, feature-local, shared UI,
  shared data-access, and shared store modules belong.
- Align compatibility docs and OpenSpec behavior requirements with the new
  frontend layout baseline.

## Capabilities

### New Capabilities

- `frontend-module-boundaries`: defines the baseline source layout and ownership
  rules for route modules, feature-scoped code, shared UI, stores, and
  API-facing frontend modules.

### Modified Capabilities

- `frontend-protected-user-profile`: require the first protected feature flow to
  live inside the documented feature/module layout instead of remaining attached
  to repo-root source folders.

## Impact

- Affects `frontend-web` source layout under `src/`, especially route modules,
  feature folders, shared UI/bootstrap areas, stores, and API-facing modules.
- Adds a new canonical OpenSpec capability for frontend module-boundary
  conventions and updates the protected profile capability to reflect the
  embodied baseline structure.
- Influences future frontend implementation patterns and lightweight
  compatibility docs, without changing backend contracts or Clerk behavior.
