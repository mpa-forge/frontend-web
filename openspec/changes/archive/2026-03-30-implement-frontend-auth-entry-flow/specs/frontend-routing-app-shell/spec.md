## MODIFIED Requirements

### Requirement: Frontend defines the baseline route map for auth and protected pages

`frontend-web` SHALL define an initial browser route map that reserves
`/sign-in` and `/sign-up` as public auth-entry routes and treats `/` as the
first protected app-shell route for authenticated product pages. Those
app-owned auth-entry routes MUST host the real Clerk handoff behavior for
sign-in and sign-up instead of remaining placeholder route shells.

#### Scenario: Protected home route is part of the baseline map

- **WHEN** a developer inspects the frontend route configuration
- **THEN** the route map includes a protected app route at `/` for the first
  authenticated feature flow

#### Scenario: Auth-entry routes are explicitly owned by the app

- **WHEN** a developer inspects the frontend route configuration
- **THEN** the route map includes public `/sign-in` and `/sign-up` entries for
  Clerk auth handoff

#### Scenario: Auth-entry routes no longer stop at placeholder content

- **WHEN** an unauthenticated browser session opens `/sign-in` or `/sign-up`
- **THEN** the app-owned route hands the browser into the real auth-entry flow
  instead of stopping at a placeholder explanation page
