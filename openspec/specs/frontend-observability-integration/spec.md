# frontend-observability-integration Specification

## Purpose

Define the shared browser observability bootstrap, route tracking, auth-driven
user-context sync, and protected-flow correlation baseline for `frontend-web`.

## Requirements

### Requirement: Frontend bootstraps one shared observability runtime

`frontend-web` SHALL initialize browser observability through one shared
runtime created from `@mpa-forge/platform-frontend-observability` and expose it
to the authenticated SPA through a single app-owned provider path. That runtime
MUST use only browser-safe frontend configuration and MUST support runtime
enable or disable behavior without requiring feature-level wiring.

#### Scenario: App bootstrap owns the observability runtime

- **WHEN** a developer inspects the frontend bootstrap and provider modules
- **THEN** the app creates one shared frontend observability runtime and mounts
  it through an app-owned provider instead of constructing observability logic
  inside individual feature pages

#### Scenario: Disabled observability does not require page rewrites

- **WHEN** browser observability is disabled through the frontend runtime
  contract
- **THEN** the authenticated SPA still boots through the shared provider path
  without requiring feature-level code changes to turn observability off

### Requirement: Router and app bootstrap own baseline browser telemetry

The authenticated SPA SHALL emit baseline browser telemetry through app- or
router-owned integration points rather than bespoke page-component hooks. That
baseline MUST include route-driven page views, client-side error capture, and
Web Vitals or equivalent user-experience signals through the shared runtime.

#### Scenario: Route transitions emit shared page views

- **WHEN** the browser enters or changes routes inside the authenticated SPA
- **THEN** a router-owned tracker emits page-view telemetry through the shared
  frontend observability runtime

#### Scenario: App bootstrap captures client failures and UX signals

- **WHEN** a browser error, unhandled promise rejection, or Web Vitals metric
  occurs after the app boots
- **THEN** the app-owned observability bootstrap captures that signal through
  the shared frontend observability runtime instead of leaving it to
  feature-local code

### Requirement: Observability user context follows frontend auth state

The shared frontend observability runtime MUST keep its user context aligned
with the current frontend auth state so authenticated telemetry can be tied to
the signed-in member session and signed-out sessions do not retain stale member
context.

#### Scenario: Signed-in auth state populates member user context

- **WHEN** the frontend auth provider reports an authenticated browser session
- **THEN** the shared observability runtime records the current member user
  context derived from that auth snapshot

#### Scenario: Signed-out state clears member user context

- **WHEN** the frontend auth provider reports that the browser is signed out or
  no usable auth session is available
- **THEN** the shared observability runtime clears any previously recorded
  member user context
