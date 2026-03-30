# frontend-protected-user-profile Specification

## Purpose

TBD - created by archiving change integrate-generated-client-frontend. Update Purpose after archive.

## Requirements

### Requirement: Frontend renders the protected current-user profile flow

The frontend SHALL provide a protected UI flow that uses the generated
`UserService` client to provision and read the current user profile, then render
the resulting user data in the app.

#### Scenario: Authenticated user sees profile data from the protected API

- **WHEN** an authenticated browser session opens the protected user-profile
  flow
- **THEN** the frontend calls the generated profile procedures and renders the
  returned current-user profile data

### Requirement: Profile read flow provisions before reading

The protected user-profile flow MUST call
`EnsureCurrentUserProfile` before `GetCurrentUser` so the frontend follows the
backend provisioning contract for first-time authenticated users.

#### Scenario: First authenticated flow provisions before read

- **WHEN** the frontend runs the protected current-user flow
- **THEN** it invokes `EnsureCurrentUserProfile` before requesting
  `GetCurrentUser`

### Requirement: Protected user-profile states are explicit in the UI

The protected user-profile flow SHALL distinguish loading, unauthenticated, API
error, and successful profile states in the rendered UI.

#### Scenario: Unauthenticated user is not shown a fake profile

- **WHEN** the user does not have a valid authenticated session
- **THEN** the frontend renders an unauthenticated state instead of pretending a
  protected profile request succeeded

#### Scenario: Protected request failures surface as an error state

- **WHEN** the generated protected profile call fails after authentication
- **THEN** the frontend renders an API-error state instead of silently hiding
  the failure
