## Context

`P2-T10A` intentionally stopped at placeholder auth-entry routes. The frontend
now owns `/sign-in` and `/sign-up` in the route map, but
[`AuthEntryRoute`](C:/Users/Miquel/dev/frontend-web/src/routes/auth/AuthEntryRoute.tsx)
still renders explanatory placeholder content instead of a real Clerk SPA
flow. That leaves one obvious gap in the authenticated frontend baseline:
unauthenticated users can be redirected to a stable route, but they cannot
finish sign-in or sign-up there and return to the protected app flow.

The repo already uses `@clerk/clerk-react` for browser auth state and already
configures `signInUrl`, `signUpUrl`, and fallback redirect URLs in
`FrontendAuthProvider`. The missing piece is route-local auth-entry behavior
that turns those app-owned routes into a real Clerk entry flow while preserving
the existing protected-route redirect contract and the current-user profile
proof.

## Goals / Non-Goals

**Goals:**

- Replace the placeholder auth-entry route content with a real Clerk-backed SPA
  sign-in and sign-up flow.
- Preserve the existing app-owned `/sign-in` and `/sign-up` route contract from
  `P2-T10A`.
- Preserve or improve `redirectTo` handling so protected-route redirects return
  users to the intended protected path after successful authentication.
- Keep the existing protected route boundary, app shell, generated-client flow,
  and module-boundary conventions intact.
- Update docs and tests so the repo baseline describes the real auth-entry
  behavior instead of a future placeholder.

**Non-Goals:**

- Change backend auth verification, Clerk dashboard configuration, or bearer
  token semantics.
- Redesign the protected app shell or the current-user profile flow beyond what
  is needed to complete authentication and return to it.
- Introduce a new public landing-page experience beyond the auth-entry routes.
- Rework the shared generated-client/query behavior already established in
  `P2-T10B`.

## Decisions

### Use Clerk route-rendered auth components inside the app-owned routes

- `/sign-in` and `/sign-up` should render the real Clerk SPA auth-entry flow
  from the route layer instead of showing placeholder text.
- The route stays app-owned and React Router-controlled, but the route content
  is now Clerk-managed auth UI or the corresponding Clerk route handoff.

Why:

- The frontend already uses Clerk React in-browser and already reserves these
  routes. Rendering the real Clerk entry flow inside them completes the missing
  behavior without changing the URL contract.

Alternative considered:

- Redirect straight to a hosted Clerk page outside the SPA.
- Rejected because the existing repo baseline already documents app-owned SPA
  routes and the task explicitly calls for the chosen Clerk SPA route model.

### Preserve a resolved post-auth redirect target in the route layer

- Continue reading `redirectTo` from the auth-entry route query string.
- Resolve a safe post-auth target in the route layer, defaulting to the
  protected home route when no target is present.
- Pass that target into the real Clerk auth-entry flow so successful
  authentication returns to the intended protected path.

Why:

- The protected route boundary already redirects signed-out users to sign-in
  with a `redirectTo` parameter. Completing the auth flow without honoring that
  value would break the intended return path.

Alternative considered:

- Always return to `/` after sign-in or sign-up.
- Rejected because it loses route intent and weakens the protected-route
  redirect contract.

### Keep signed-in and auth-unavailable handling explicit at the route layer

- If the user is already signed in, the auth-entry route should redirect to the
  resolved protected target instead of rendering auth UI again.
- If usable Clerk frontend configuration is missing, the auth-entry route
  should continue rendering a distinct unavailable/configuration state instead
  of failing silently.

Why:

- These are route-state decisions, not feature-page concerns, and they keep the
  browser behavior predictable in both local misconfiguration and real signed-in
  sessions.

Alternative considered:

- Let Clerk components implicitly handle every state.
- Rejected because the repo already exposes explicit auth-config diagnostics and
  the route layer should keep that control.

## Risks / Trade-offs

- [Clerk route props or redirect APIs may differ from the placeholder route
  assumptions] -> Keep the route contract small and drive the design from the
  current `@clerk/clerk-react` primitives already in use by the repo.
- [Redirect handling could accidentally allow users to remain on auth-entry
  routes after auth] -> Resolve one route-local post-auth target and test both
  direct visits and protected-route redirects.
- [Missing Clerk config may still prevent a full local proof in some
  environments] -> Preserve the explicit auth-unavailable route state and keep
  docs clear about the required frontend and backend Clerk setup.
- [Tests may become more coupled to Clerk rendering details] -> Focus tests on
  route behavior, redirect handling, and whether the real auth flow is invoked,
  not on Clerk internal markup.

## Migration Plan

1. Replace the placeholder `/sign-in` and `/sign-up` route contents with the
   real Clerk SPA auth-entry flow.
2. Resolve and pass the post-auth redirect target through the route layer so
   protected-route redirects and direct auth-entry visits converge on one return
   rule.
3. Update route-level tests and any browser smoke coverage for auth-entry
   behavior.
4. Update auth/bootstrap docs to describe the real route behavior.
5. Validate the repo and archive the change into canonical specs.

## Open Questions

- None currently. The repo already commits to app-owned SPA auth routes and a
  Clerk React frontend baseline, so the remaining work is to implement that
  route behavior concretely.
