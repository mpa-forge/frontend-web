## Why

The frontend now has a protected app-shell baseline, but it still needs a canonical way to construct generated API clients, inject Clerk bearer tokens, and manage protected API reads and writes consistently. We need to lock that pattern now so the first protected flow and later features do not drift into ad hoc transport, error-handling, and query logic.

## What Changes

- Expand the generated-client integration contract so `frontend-web` uses one reusable browser transport and client-construction path for `@mpa-forge/platform-contracts-client`.
- Add a frontend data-fetching conventions capability that explicitly owns TanStack Query bootstrap for the repo, plus the baseline protected query/mutation pattern including query-key ownership, bootstrap-then-read sequencing, and loading/error behavior.
- Tighten the protected current-user profile capability so the first protected flow goes through the shared generated-client and query conventions instead of feature-local one-off wiring.
- Document the compatibility impact for frontend bootstrap and runtime docs where the shared API wiring becomes part of the repo baseline.

## Capabilities

### New Capabilities

- `frontend-data-fetching-conventions`: repo-wide TanStack Query bootstrap and protected data-access conventions for generated contract clients.

### Modified Capabilities

- `frontend-generated-client-integration`: extend requirements to cover reusable client construction, token injection, API base URL selection, and shared error mapping for generated clients.
- `frontend-protected-user-profile`: require the first protected profile flow to use the shared generated-client wiring and query conventions.

## Impact

- Affects `frontend-web` route-adjacent data wiring, shared auth-aware API helpers, and protected feature data flow.
- Changes OpenSpec behavior contracts for generated client integration and protected profile fetching.
- Influences frontend docs and future feature implementation patterns, but does not change backend or Clerk contracts.
