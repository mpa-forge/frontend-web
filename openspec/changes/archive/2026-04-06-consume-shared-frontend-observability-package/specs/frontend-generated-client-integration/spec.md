## MODIFIED Requirements

### Requirement: Protected generated calls send Clerk bearer tokens

Protected generated client calls MUST attach `Authorization: Bearer <token>`
through the shared generated-client transport path using the current Clerk
session token in the browser. That same shared transport path MUST also attach
frontend observability correlation metadata, including the runtime-generated
correlation id and the shared frontend app/environment/release labels, instead
of leaving correlation-header construction to feature-local request code.

#### Scenario: UserService calls carry auth and correlation metadata

- **WHEN** the frontend invokes a protected generated `UserService` procedure
- **THEN** the shared generated-client transport includes the current Clerk
  bearer token and the shared frontend observability correlation headers on the
  outgoing request
