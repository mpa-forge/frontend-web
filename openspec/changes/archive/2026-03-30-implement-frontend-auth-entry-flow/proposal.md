## Why

`frontend-web` already reserves `/sign-in` and `/sign-up`, but those routes
still render placeholder pages instead of a real auth-entry flow. We need to
upgrade them now so unauthenticated users can complete a real Clerk SPA sign-in
or sign-up path, then return to the protected app and finish the current-user
profile proof required by Phase 2.

## What Changes

- Replace the placeholder `/sign-in` and `/sign-up` route contents with a real
  Clerk-backed SPA auth-entry flow owned by the frontend route layer.
- Preserve post-auth redirect behavior so protected-route redirects and
  auth-entry route visits return the browser to the protected app path after
  successful authentication.
- Keep the existing protected route boundary, app-shell baseline, and shared
  generated-client/query integration intact while wiring the auth-entry flow
  into the same frontend auth contract.
- Update repo-local auth bootstrap guidance and tests so the documented Clerk
  route behavior matches the implemented frontend flow.

## Capabilities

### New Capabilities

- `frontend-auth-entry-flow`: covers the real `/sign-in` and `/sign-up` SPA
  auth-entry behavior, including Clerk UI or redirect handoff plus post-auth
  return to the protected app flow.

### Modified Capabilities

- `frontend-routing-app-shell`: clarify that the app-owned auth-entry routes are
  no longer placeholders and now hand users into the real auth-entry flow while
  preserving protected-route redirect targets.

## Impact

- Affects `frontend-web` auth-entry route modules, frontend auth provider
  integration, and route-local redirect behavior for signed-out sessions.
- Adds a new OpenSpec capability for frontend auth-entry flow and updates the
  routing/app-shell capability to align with the real route behavior.
- Influences frontend docs and test coverage, but does not change backend auth
  semantics or generated protected API contracts.
