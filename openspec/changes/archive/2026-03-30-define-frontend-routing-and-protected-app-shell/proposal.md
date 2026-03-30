## Why

`frontend-web` now proves the generated protected API call, but it still runs as
one undifferentiated shell with placeholder auth links instead of a canonical
route map and protected app boundary. `P2-T10A` exists to turn that proof into a
reusable frontend baseline so later feature work has an obvious protected home
and unauthenticated users are redirected or blocked consistently.

## What Changes

- Add a documented frontend routing and app-shell baseline for `frontend-web`,
  including the initial public and protected route map.
- Define protected-route behavior for loading, unauthenticated, and authorized
  browser states so protected feature pages do not implement auth gating ad hoc.
- Wire the first protected feature flow into the new app shell so the current
  user profile lives under the protected baseline instead of the top-level
  runtime page.
- Define the minimum shell layout and Clerk sign-in/sign-out handoff points that
  later authenticated pages can reuse.
- Add or update focused tests that cover baseline routing and protected-shell
  behavior, including browser smoke coverage for the shell entrypoint and the
  initial auth-entry routes.

## Capabilities

### New Capabilities

- `frontend-routing-app-shell`: Covers the authenticated route map, protected
  route boundary, shared app shell layout, and auth-state handling for frontend
  pages.

### Modified Capabilities

- `frontend-protected-user-profile`: Clarify that the protected current-user
  profile flow lives inside the protected routing/app-shell baseline rather than
  as an unstructured top-level page.

## Impact

- Affected code: React app bootstrap, route wiring, auth boundary components,
  shell layout, protected profile page placement, and related tests.
- Affected dependencies: frontend router support and any minimal Clerk routing
  glue needed to host the baseline auth flow.
- Affected systems: browser auth navigation, protected frontend UX, and the
  first authenticated product page structure used by later Phase 2 tasks.
