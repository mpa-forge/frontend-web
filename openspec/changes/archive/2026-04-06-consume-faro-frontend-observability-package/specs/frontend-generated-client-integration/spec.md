## MODIFIED Requirements

### Requirement: Protected generated calls send Clerk bearer tokens

Protected generated client calls MUST attach `Authorization: Bearer <token>` through the shared generated-client transport path using the current Clerk session token in the browser, and that same shared transport MUST attach the frontend observability request-correlation metadata produced by `@mpa-forge/platform-frontend-observability`.

#### Scenario: UserService calls carry the browser bearer token and shared correlation headers

- **WHEN** the frontend invokes a protected generated `UserService` procedure
- **THEN** the shared generated-client transport includes the current Clerk bearer token in the `Authorization` header and the shared observability correlation headers instead of leaving either concern to feature-local request code
