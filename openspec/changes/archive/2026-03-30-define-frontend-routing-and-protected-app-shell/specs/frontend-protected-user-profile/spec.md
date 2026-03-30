## MODIFIED Requirements

### Requirement: Frontend renders the protected current-user profile flow

The frontend SHALL provide the protected current-user profile flow as a page
inside the protected app-shell route, using the generated `UserService` client
to provision and read the current user profile, then render the resulting user
data in the app.

#### Scenario: Authenticated user sees profile data from the protected shell

- **WHEN** an authenticated browser session opens the protected app-shell home
  that hosts the user-profile page
- **THEN** the frontend calls the generated profile procedures and renders the
  returned current-user profile data inside the protected layout

### Requirement: Protected user-profile states are explicit in the UI

The protected user-profile page SHALL distinguish loading, API error, and
successful profile states in the rendered UI, while unauthenticated access is
handled by the shared protected-route boundary.

#### Scenario: Unauthenticated browser sessions do not render a fake profile page

- **WHEN** the user does not have a valid authenticated session for the
  protected profile route
- **THEN** the shared protected-route boundary intercepts the route before the
  profile page renders fake protected content

#### Scenario: Protected request failures surface as an error state

- **WHEN** the generated protected profile call fails after authentication
- **THEN** the frontend renders an API-error state instead of silently hiding
  the failure
