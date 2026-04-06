## ADDED Requirements

### Requirement: Frontend app shell initializes the shared observability runtime

`frontend-web` SHALL initialize browser observability through `@mpa-forge/platform-frontend-observability` using one app-bootstrap path that passes browser-safe app identity, environment, release, enablement, and ingest configuration into the shared runtime without importing Grafana Faro directly.

#### Scenario: App bootstrap uses the shared package as the only initialization path

- **WHEN** the authenticated app shell starts with observability enabled
- **THEN** it creates and provides the shared frontend observability runtime through the package-owned bootstrap path instead of creating app-local provider or transport wiring

#### Scenario: Disabled or incomplete observability config remains safe

- **WHEN** observability is disabled or the optional browser-safe ingest config is absent
- **THEN** the app still receives a usable shared runtime handle whose methods remain safe to call during bootstrap, routing, and protected requests

### Requirement: Router and global browser telemetry use package-owned helpers

`frontend-web` SHALL record baseline browser telemetry through package-owned helpers for route-driven page views, client-side errors, and Web Vitals so feature page components do not need bespoke observability wiring.

#### Scenario: Route changes are tracked from the router boundary

- **WHEN** the active browser route changes inside the app router
- **THEN** a router-owned integration path reports the page view through the shared package instead of adding telemetry code to feature pages

#### Scenario: Global browser signals flow through the shared runtime

- **WHEN** the app captures a client-side error, unhandled rejection, or supported Web Vital signal
- **THEN** it reports that signal through the shared runtime contract exposed by the package

### Requirement: Protected generated requests preserve frontend-to-backend correlation

`frontend-web` SHALL attach package-generated frontend observability correlation metadata to protected generated-client requests while preserving the existing Clerk bearer-token transport boundary.

#### Scenario: Protected requests include shared correlation metadata

- **WHEN** the shared protected generated-client transport prepares a protected API request
- **THEN** it attaches the shared frontend observability request-context headers together with the Clerk bearer token without requiring feature-local request code

#### Scenario: Browser delivery stays on the provider-supported frontend path

- **WHEN** `frontend-web` configures browser observability delivery
- **THEN** it uses the shared package's browser-safe ingest/Faro configuration path and does not depend on a dedicated browser telemetry endpoint in `backend-api`
