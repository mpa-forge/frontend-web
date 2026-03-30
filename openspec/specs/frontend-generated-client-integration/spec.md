# frontend-generated-client-integration Specification

## Purpose

TBD - created by archiving change integrate-generated-client-frontend. Update Purpose after archive.
## Requirements
### Requirement: Frontend code uses the generated contracts package

`frontend-web` SHALL consume the generated browser contract surface from
`@mpa-forge/platform-contracts-client` rather than importing sibling-repo
generated files or defining hand-written DTO shapes for the protected
`UserService` flow.

#### Scenario: Generated contract imports stay package-based

- **WHEN** frontend code imports the protected user-profile contract
- **THEN** it imports generated services and message types from
  `@mpa-forge/platform-contracts-client`

### Requirement: Published package installs use committed scoped registry config

The repository SHALL commit the `@mpa-forge` scoped registry mapping for GitHub
Packages and MUST source package-read credentials from an external environment
variable rather than committed secrets.

#### Scenario: Frontend consumer config keeps credentials out of the repo

- **WHEN** a developer inspects the repo-local package-consumer configuration
- **THEN** the GitHub Packages scope mapping is committed and credential auth is
  sourced from an environment variable instead of a committed token

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

