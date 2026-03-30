## MODIFIED Requirements

### Requirement: Generated client transport uses the configured API base URL

The frontend SHALL create generated Connect clients through a reusable browser transport and client-construction layer that targets the configured `VITE_API_BASE_URL`.

#### Scenario: Protected client uses the documented runtime API base URL

- **WHEN** the frontend constructs a generated `UserService` client
- **THEN** the shared transport and client-construction layer points at the configured `VITE_API_BASE_URL`

### Requirement: Protected generated calls send Clerk bearer tokens

Protected generated client calls MUST attach `Authorization: Bearer <token>` through the shared generated-client transport path using the current Clerk session token in the browser.

#### Scenario: UserService calls carry the browser bearer token

- **WHEN** the frontend invokes a protected generated `UserService` procedure
- **THEN** the shared generated-client transport includes the current Clerk bearer token in the `Authorization` header instead of leaving token injection to feature-local request code
