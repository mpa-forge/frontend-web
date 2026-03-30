## MODIFIED Requirements

### Requirement: Frontend renders the protected current-user profile flow

The frontend SHALL provide the protected current-user profile flow as a
feature-owned page inside the protected app-shell route, using the shared
generated-client integration and TanStack Query conventions to provision and
read the current user profile before rendering the resulting data in the app.
The route layer MUST import that page from the current-user feature folder
instead of keeping the flow attached to repo-root source modules.

#### Scenario: Authenticated user sees profile data from the protected shell

- **WHEN** an authenticated browser session opens the protected app-shell home
  that hosts the user-profile page
- **THEN** the frontend runs the shared protected bootstrap-and-read flow and
  renders the returned current-user profile data inside the protected layout

#### Scenario: Current-user modules are colocated under the owning feature

- **WHEN** a developer inspects the source tree for the protected current-user
  flow
- **THEN** the current-user page and its feature-owned modules live in the
  current-user feature folder while the route tree imports that page from the
  route-owned layer
