# frontend-routing-app-shell Specification

## Purpose

Define the baseline browser route map, protected-route gating, and shared
authenticated app shell for `frontend-web`.

## Requirements

### Requirement: Frontend defines the baseline route map for auth and protected pages

`frontend-web` SHALL define an initial browser route map that reserves
`/sign-in` and `/sign-up` as public auth-entry routes and treats `/` as the
first protected app-shell route for authenticated product pages.

#### Scenario: Protected home route is part of the baseline map

- **WHEN** a developer inspects the frontend route configuration
- **THEN** the route map includes a protected app route at `/` for the first
  authenticated feature flow

#### Scenario: Auth-entry routes are explicitly owned by the app

- **WHEN** a developer inspects the frontend route configuration
- **THEN** the route map includes public `/sign-in` and `/sign-up` entries for
  Clerk auth handoff

### Requirement: Protected routes centralize auth-state gating

Protected routes MUST evaluate auth-loading, auth-unavailable, unauthenticated,
and authorized states through a shared route boundary before protected page
content is rendered.

#### Scenario: Auth-loading does not render protected page content early

- **WHEN** the browser opens a protected route before Clerk auth state is ready
- **THEN** the frontend renders a loading state instead of protected page
  content

#### Scenario: Unauthenticated browser sessions are redirected or blocked consistently

- **WHEN** the browser opens a protected route without a valid authenticated
  session
- **THEN** the shared protected-route boundary redirects the user to the
  configured sign-in handoff or blocks access with the documented unauthenticated
  state

#### Scenario: Missing auth configuration surfaces a distinct unavailable state

- **WHEN** the frontend is missing usable Clerk browser configuration for a
  protected route
- **THEN** the route boundary renders an auth-unavailable state instead of
  pretending the user merely signed out

### Requirement: Protected pages render inside a shared app shell

The protected frontend baseline SHALL provide a shared app-shell layout for
authenticated pages that includes route-level structure and auth handoff points
for the first protected feature flow.

#### Scenario: Authenticated user sees the first protected page inside the shell

- **WHEN** an authenticated browser session opens the protected home route
- **THEN** the current protected feature page renders inside the shared app-shell
  layout instead of as a standalone top-level screen

#### Scenario: Shared shell exposes auth handoff controls

- **WHEN** an authenticated user views the protected app shell
- **THEN** the shell exposes the baseline sign-out handoff and identifies the
  signed-in user context used by protected pages
