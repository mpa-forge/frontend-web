## Context

`frontend-web` currently mounts a single `App` component inside
`FrontendAuthProvider`. That shell proves runtime configuration and the
generated protected `UserService` flow, but it does not define where protected
pages live, how auth gating is shared across routes, or which paths own the
sign-in and sign-up handoff. The shared platform specification already locks
React Router as part of the frontend stack, and downstream Phase 2 tasks
(`P2-T10B`, `P2-T10C`, and `P2-T10D`) assume a stable routing baseline instead
of continuing from a single-page shell.

The repo also already documents `/sign-in` and `/sign-up` as the default Clerk
SPA paths in `.env.example` and `docs/frontend-auth-bootstrap.md`. This change
should turn those documented paths into an explicit route map while keeping the
existing Bun/Vite/make workflow and the current protected profile proof intact.

## Goals / Non-Goals

**Goals:**

- Introduce a minimal React Router baseline for `frontend-web`.
- Define a canonical route map with explicit ownership of public auth-entry
  paths and the first protected app path.
- Centralize protected-route behavior so loading, unauthenticated, and signed-in
  states are handled by shared routing primitives instead of per-page checks.
- Establish a reusable authenticated app-shell layout that hosts the current
  user profile proof and future protected feature pages.
- Preserve the current runtime and protected-client proof while moving it into a
  route-based structure.

**Non-Goals:**

- Implement the full Clerk sign-in/sign-up UI flow; that remains the purpose of
  `P2-T10D`.
- Define TanStack Query usage, reusable data-fetching conventions, or transport
  abstraction beyond the existing generated-client baseline; that belongs to
  `P2-T10B`.
- Define the long-term feature/module folder layout beyond what routing needs to
  land; that belongs to `P2-T10C`.
- Change backend contracts, auth semantics, or local-stack topology.

## Decisions

### Use React Router now and model the app with nested route ownership

`frontend-web` will adopt `react-router-dom` and move app composition from a
single `App` render to a router-owned tree. A small router module should define
the initial route map and nested layouts so later feature work extends the
existing structure rather than replacing it.

Alternatives considered:

- Keep the app single-page until `P2-T10D`. Rejected because later tasks
  already depend on a route baseline and would otherwise invent one while
  implementing auth or data-fetching work.
- Introduce a large route-module hierarchy immediately. Rejected because the
  repo does not yet need a wide route tree and `P2-T10C` is the intended place
  to formalize broader module boundaries.

### Treat `/` as the first protected app-shell route

The initial protected home should remain `/`, with `/sign-in` and `/sign-up`
reserved as public auth-entry routes. This keeps the existing Clerk fallback
redirect defaults stable and makes the first authenticated feature path the
landing page after successful sign-in.

Alternatives considered:

- Make `/app` the protected root and leave `/` public. Rejected because it
  would force an immediate env-contract and redirect-default change without a
  product need for a separate public landing page.

### Move auth gating into a shared protected-route boundary

Protected pages should be wrapped by a shared route boundary that decides among
auth-loading, auth-unavailable, unauthenticated handoff, and authorized render
states. This removes duplicate auth checks from the profile page and gives later
protected routes one baseline behavior to reuse.

Alternatives considered:

- Let every protected page query Clerk state and render its own unauthenticated
  fallback. Rejected because the route behavior would drift as soon as a second
  protected page is added.

### Keep auth-entry routes explicit now even if their concrete UI is deferred

`/sign-in` and `/sign-up` should exist in the route map and own the handoff
surface, but this change does not need to decide whether those routes render
Clerk components, perform redirects, or show a temporary route-local handoff.
`P2-T10D` can upgrade the route internals later without changing the path
contract established here.

Alternatives considered:

- Omit auth-entry routes until `P2-T10D`. Rejected because the frontend already
  documents those paths and the protected-route baseline needs stable targets
  for redirect or handoff behavior.

### Expose sign-out from the shared shell as a baseline auth handoff

The protected app shell should include one explicit sign-out handoff control
owned by the shared authenticated layout. This change only needs to define the
integration point and baseline behavior for sign-out from protected pages; it
does not need to redesign Clerk session UX beyond invoking the existing Clerk
sign-out capability and returning the browser to the documented signed-out path.

Alternatives considered:

- Leave sign-out embedded in page-level implementations. Rejected because the
  baseline shell is supposed to centralize shared auth handoff behavior for
  protected routes.
- Defer sign-out entirely until `P2-T10D`. Rejected because the platform plan
  already expects the authenticated shell baseline to include login/logout
  handoff, even if the sign-in and sign-up route internals continue evolving.

### Re-home the current-user profile as the first protected page inside the shell

The generated-client proof should move under the protected app shell as the
index page for the initial authenticated experience. The profile page can keep
its current loading, success, and API-error behaviors, while unauthenticated
handling moves to the route boundary.

Alternatives considered:

- Leave the profile proof embedded in the shell component. Rejected because it
  keeps route ownership and page responsibilities blurred.

## Risks / Trade-offs

- [Router adoption touches app bootstrap, tests, and auth links] -> keep the
  first tree small and update repo-local tests alongside the router change.
- [A shared auth guard could hide useful missing-config diagnostics] -> include
  an explicit auth-unavailable/config state instead of treating every failure as
  a normal signed-out session.
- [Choosing `/` as the protected home leaves no public landing page baseline] ->
  accept that trade-off for Phase 2 and add a separate public root only if a
  later product requirement appears.
- [Deferring full auth-entry behavior to `P2-T10D` can leave temporary route
  internals] -> keep the path contract stable now so the later task only changes
  route contents, not route ownership.

## Migration Plan

1. Add `react-router-dom` and move frontend bootstrap to a router-owned render
   path.
2. Create the initial public auth-entry routes and the protected shell route.
3. Implement a shared protected-route boundary that handles loading, missing
   auth configuration, unauthenticated handoff, and authorized render.
4. Move the current-user profile proof into the protected shell index page.
5. Update docs and tests to describe and verify the new route structure.

## Open Questions

- None. This design intentionally reserves the detailed `/sign-in` and
  `/sign-up` implementation choice for `P2-T10D` while locking the route and
  shell structure now.
