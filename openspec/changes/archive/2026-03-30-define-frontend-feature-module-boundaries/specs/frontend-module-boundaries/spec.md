## ADDED Requirements

### Requirement: Frontend defines a baseline module layout for app, routes, features, shared UI, API infrastructure, and stores

`frontend-web` SHALL embody a baseline source layout that separates app-wide
bootstrap and shell modules, route modules, feature-owned code, shared UI,
shared API/data-access infrastructure, and app-wide store modules so later work
does not accumulate in a flat `src/` tree.

#### Scenario: Developers can identify ownership from the source tree

- **WHEN** a developer inspects the baseline frontend source tree
- **THEN** app-shell and bootstrap modules live in an app-wide area, route-tree
  modules live in a route-owned area, feature code lives in feature folders,
  shared API/data-access infrastructure lives in a shared API area, and
  app-wide Zustand stores live in a shared stores area

### Requirement: Route modules compose browser paths and feature entrypoints

The frontend route tree MUST be defined in route-owned modules that compose
paths, auth boundaries, and layout wrappers while importing feature-owned page
modules instead of embedding feature logic directly in the route layer.

#### Scenario: Protected route tree stays in a route-owned area

- **WHEN** a developer updates the protected browser route map
- **THEN** the route entry files are found in the route-owned area and import the
  page modules they render from the owning feature folders

### Requirement: Feature folders own feature-local modules by default

The frontend SHALL keep feature-local pages, components, hooks,
transformations, tests, and feature-specific API wrappers inside the owning
`src/features/<feature>/` folder until they have proven cross-feature reuse or
clear app-wide ownership.

#### Scenario: Single-feature code stays in the feature folder

- **WHEN** a module is only used by one protected feature
- **THEN** the module remains inside that feature folder instead of being
  promoted into a repo-wide shared area

#### Scenario: Shared extraction happens only after real reuse or app-wide ownership

- **WHEN** a frontend module becomes reused across multiple features or clearly
  belongs to app-shell or bootstrap behavior
- **THEN** the module may move into the shared app or shared UI layer with its
  feature-specific assumptions removed

### Requirement: Shared stores and API modules follow ownership scope

The frontend MUST reserve shared store and API infrastructure areas for app-wide
runtime concerns, generated-client/query bootstrap, canonical error handling,
and other cross-feature contracts, while keeping feature-owned state and API
wrappers inside the owning feature folder.

#### Scenario: App-wide runtime state stays in the shared store area

- **WHEN** a Zustand store represents runtime configuration or shell-level UI
  state used across the application
- **THEN** the store lives in the shared stores area instead of a feature folder

#### Scenario: Feature-owned data wrappers stay local while reusing shared infrastructure

- **WHEN** a protected feature defines a query hook or API wrapper that only
  serves that feature
- **THEN** the module lives in the feature folder and consumes the shared API
  transport and query infrastructure instead of redefining it globally
