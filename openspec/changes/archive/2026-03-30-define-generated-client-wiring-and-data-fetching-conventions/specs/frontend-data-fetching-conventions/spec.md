## ADDED Requirements

### Requirement: Frontend bootstraps one shared TanStack Query runtime

`frontend-web` SHALL install and bootstrap one shared TanStack Query runtime for protected generated data flows instead of leaving query support to feature-local setup.

#### Scenario: App entrypoint bootstraps the shared query runtime

- **WHEN** the frontend application starts
- **THEN** the root application tree includes one shared TanStack Query provider used by protected generated data flows

### Requirement: Protected generated data access uses shared TanStack Query conventions

`frontend-web` SHALL provide a shared protected data-access pattern that uses TanStack Query for generated contract reads and writes instead of feature-local ad hoc fetch state.

#### Scenario: Protected feature queries use the shared query pattern

- **WHEN** a protected page needs server data through the generated contracts client
- **THEN** it uses the repo's shared TanStack Query integration pattern instead of manual request state wiring

### Requirement: Shared data access owns canonical query keys and bootstrap sequencing

The shared protected data-access layer MUST own canonical query keys and the standard provisioning-before-read sequence for generated protected user data.

#### Scenario: First protected user flow provisions before reading

- **WHEN** the frontend loads protected current-user data for an authenticated session
- **THEN** it runs the idempotent `EnsureCurrentUserProfile` mutation before the `GetCurrentUser` query
- **AND** the subsequent profile read uses the shared canonical query key owned by the data-access layer

#### Scenario: Later features reuse canonical keys instead of inventing their own

- **WHEN** a later protected feature needs the same generated server resource already covered by the shared pattern
- **THEN** it reuses the canonical query key and sequencing rules from the shared data-access layer instead of defining a second key for that resource

### Requirement: Protected generated failures map to explicit frontend states

The shared protected data-access layer MUST classify missing configuration, auth-token acquisition failure, and API request failure into explicit error categories that protected features can render consistently.

#### Scenario: Protected feature receives a classified API-access error

- **WHEN** a protected generated request cannot be executed successfully
- **THEN** the shared frontend data-access layer returns an explicit frontend error classification instead of leaving each feature to infer failure semantics itself
