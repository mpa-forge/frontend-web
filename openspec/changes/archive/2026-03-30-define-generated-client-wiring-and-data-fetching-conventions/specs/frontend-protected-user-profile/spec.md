## MODIFIED Requirements

### Requirement: Frontend renders the protected current-user profile flow

The frontend SHALL provide the protected current-user profile flow as a page inside the protected app-shell route, using the shared generated-client integration and TanStack Query conventions to provision and read the current user profile before rendering the resulting data in the app.

#### Scenario: Authenticated user sees profile data from the protected shell

- **WHEN** an authenticated browser session opens the protected app-shell home that hosts the user-profile page
- **THEN** the frontend runs the shared protected bootstrap-and-read flow and renders the returned current-user profile data inside the protected layout

### Requirement: Profile read flow provisions before reading

The protected user-profile flow MUST call `EnsureCurrentUserProfile` before `GetCurrentUser` through the shared protected data-access conventions so the frontend follows the backend provisioning contract for first-time authenticated users.

#### Scenario: First authenticated flow provisions before read

- **WHEN** the frontend runs the protected current-user flow
- **THEN** it invokes `EnsureCurrentUserProfile` before requesting `GetCurrentUser` through the shared generated-client integration path

### Requirement: Protected user-profile states are explicit in the UI

The protected user-profile page SHALL distinguish loading, API error, and successful profile states in the rendered UI, while unauthenticated access is handled by the shared protected-route boundary.

#### Scenario: Unauthenticated browser sessions do not render a fake profile page

- **WHEN** the user does not have a valid authenticated session for the protected profile route
- **THEN** the shared protected-route boundary intercepts the route before the profile page renders fake protected content

#### Scenario: Protected request failures surface as an error state

- **WHEN** the generated protected profile flow fails after authentication
- **THEN** the frontend renders an API-error state derived from the shared protected data-access conventions instead of silently hiding the failure
