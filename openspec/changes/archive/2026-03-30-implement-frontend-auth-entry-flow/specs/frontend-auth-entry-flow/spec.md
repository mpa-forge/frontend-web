## ADDED Requirements

### Requirement: Auth-entry routes render a real frontend auth flow

`frontend-web` SHALL make `/sign-in` and `/sign-up` render a real Clerk-backed
SPA auth-entry flow instead of a placeholder route-local explanation page.

#### Scenario: Sign-in route reaches the real auth flow

- **WHEN** an unauthenticated browser session opens `/sign-in`
- **THEN** the frontend renders or invokes the real Clerk sign-in flow for that
  route instead of a placeholder handoff description

#### Scenario: Sign-up route reaches the real auth flow

- **WHEN** an unauthenticated browser session opens `/sign-up`
- **THEN** the frontend renders or invokes the real Clerk sign-up flow for that
  route instead of a placeholder handoff description

### Requirement: Auth-entry flow preserves the post-auth return target

The frontend MUST preserve the protected-route `redirectTo` target through the
auth-entry flow and return the browser to the resolved protected app path after
successful authentication.

#### Scenario: Protected redirect target is preserved through sign-in

- **WHEN** an unauthenticated browser session is redirected to `/sign-in` with a
  `redirectTo` query value from a protected route
- **THEN** a successful sign-in returns the browser to that protected target
  instead of leaving the user on the auth-entry route

#### Scenario: Direct auth-entry visits fall back to the protected home route

- **WHEN** a browser session completes sign-in or sign-up from `/sign-in` or
  `/sign-up` without an explicit `redirectTo` query value
- **THEN** the frontend returns the user to the protected home route

### Requirement: Auth-entry routes handle signed-in and missing-config states explicitly

The auth-entry routes MUST redirect already-signed-in users away from the
auth-entry pages and MUST preserve a distinct unavailable/configuration state
when usable Clerk frontend configuration is missing.

#### Scenario: Signed-in user does not remain on sign-in or sign-up

- **WHEN** a signed-in browser session opens `/sign-in` or `/sign-up`
- **THEN** the frontend redirects the user to the resolved protected app path
  instead of rendering the auth-entry flow again

#### Scenario: Missing Clerk configuration remains visible at the auth-entry route

- **WHEN** the frontend lacks usable Clerk browser configuration and the browser
  opens `/sign-in` or `/sign-up`
- **THEN** the route renders a distinct auth-unavailable or configuration state
  instead of pretending the real auth flow can run
