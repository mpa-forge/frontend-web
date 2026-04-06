## Context

`frontend-web` already has the core seams needed for a clean observability
integration: `src/main.tsx` owns app bootstrap, `src/app/providers` owns
cross-cutting providers, `src/routes/AppRouter.tsx` owns the route tree, and
`src/api/protected/protectedApiClient.ts` owns the shared protected generated
transport. The missing piece is a repo-local integration layer that consumes
`@mpa-forge/platform-frontend-observability` once and keeps telemetry wiring
out of feature components.

The shared package gives this repo a browser-safe runtime, React provider,
React Router page-view hook, Web Vitals helper, auth-to-user-context helpers,
and a request-correlation header helper. It does not own `frontend-web`'s env
contract, event sink, or bootstrap order, so this change still needs local app
code to create the runtime, attach global listeners, and bridge the runtime
into the protected API client path.

Compatibility impact:

- `package.json` gains the shared observability dependency
- `.env.example`, `src/stores/runtime/runtimeStore.ts`, and
  `openspec/specs/frontend-runtime/spec.md` expand the browser-safe runtime
  contract
- `docs/frontend-runtime.md` and `docs/frontend-auth-bootstrap.md` need
  compatibility updates after implementation so the runtime and protected API
  flow remain aligned with the canonical specs

## Goals / Non-Goals

**Goals:**

- Initialize one shared frontend observability runtime for the whole SPA
- Keep route tracking, auth-user-context sync, client-error capture, and Web
  Vitals wiring in app- or router-owned modules instead of feature pages
- Attach correlation metadata for protected generated API calls through the
  shared transport path
- Keep browser config limited to `VITE_*` values and avoid frontend-held
  provider secrets
- Make the existing protected current-user flow the first validation path for
  correlated frontend telemetry

**Non-Goals:**

- Provision provider-side observability infrastructure or dashboards
- Add feature-level business telemetry beyond the app-shell baseline
- Introduce a new server-side telemetry ingestion service in this repo
- Redesign the current route tree, auth flow, or protected profile UX beyond
  what is needed for shared observability wiring

## Decisions

### Create one app-owned observability module and provider stack

- Add a small app-owned observability layer under `src/app/` that creates the
  runtime from browser-safe env values, exposes a stable runtime instance, and
  hosts bootstrap helpers such as the provider, auth bridge, and browser-event
  listeners.
- Wrap the existing provider tree with
  `FrontendObservabilityProvider` in `AppProviders` so the runtime is available
  to auth, router, and API bootstrap code without prop-drilling.

Why:

- Observability is app-wide infrastructure, not feature-owned logic.
- The repo already centralizes cross-cutting bootstrap concerns in
  `src/app/providers`.

Alternative considered:

- Instantiate the runtime directly in `main.tsx` with ad hoc hooks elsewhere.
- Rejected because it would scatter the bootstrap contract across unrelated
  files and make tests harder to follow.

### Bridge auth state into the runtime from a provider-owned helper

- Add one provider-owned bridge component that reads `useFrontendAuth()` and
  syncs the current auth snapshot into the runtime with the shared
  `useFrontendWebUserContext` helper.
- Treat sign-in as the moment the runtime gains `member` user context and
  signed-out or unavailable auth as the moment the runtime clears that context.

Why:

- The shared package already encodes the `frontend-web` auth snapshot shape.
- This keeps user-context ownership next to auth bootstrap instead of spreading
  it into feature hooks.

Alternative considered:

- Push user-context updates from protected feature pages.
- Rejected because it would miss non-feature route transitions and drift from
  the shared auth boundary.

### Keep page views, client errors, and Web Vitals in router/app bootstrap

- Mount one router-owned tracker component inside `BrowserRouter` that uses
  `useReactRouterPageViews`.
- Register app-owned listeners for `error` and `unhandledrejection`, and start
  Web Vitals tracking once at bootstrap with the shared
  `startWebVitalsTracking` helper.
- Use the runtime as the single event producer so route changes, client
  failures, and UX metrics share the same metadata and user context.

Why:

- Route transitions belong to the router tree, not page components.
- Error and Web Vitals listeners are global browser concerns and should be
  initialized once.

Alternative considered:

- Add telemetry calls directly to the protected profile page.
- Rejected because `P3-T03B` is intended to establish a reusable app-shell
  baseline, not a single page-local implementation.

### Use an app-owned browser-safe emitter instead of embedding provider secrets

- Create a lightweight emitter in `frontend-web` that receives normalized
  runtime events and forwards them through browser-safe delivery only when
  observability is enabled.
- The emitter can use an optional browser-safe endpoint when configured and may
  fall back to local development logging when no endpoint is available, but it
  must never require auth headers, static tokens, or other secrets in frontend
  code.

Why:

- The shared package intentionally leaves delivery policy to the consumer app.
- This keeps the repo aligned with the platform rule that frontend code only
  uses browser-safe `VITE_*` inputs.

Alternative considered:

- Hardcode provider-specific auth or headers in the frontend runtime config.
- Rejected because it would violate the package contract and leak secret
  handling into browser code.

### Derive request correlation inside the shared protected transport

- Extend `src/api/protected/protectedApiClient.ts` so the shared interceptor
  applies correlation headers with
  `applyRequestCorrelationHeaders(...)` before protected generated requests are
  sent.
- Derive operation metadata from the shared transport layer and current browser
  location so the current-user flow gains correlation without feature-local
  header assembly.
- Keep Clerk bearer-token injection and correlation-header injection in the
  same protected transport path so every protected generated call follows one
  contract.

Why:

- Request correlation is transport behavior, not feature behavior.
- The existing protected API client module is already the canonical place for
  auth-aware request setup.

Alternative considered:

- Have feature hooks pass route and correlation headers into each request.
- Rejected because it duplicates cross-cutting behavior and weakens the shared
  contract this change is supposed to establish.

## Risks / Trade-offs

- [Global listeners can double-fire in React Strict Mode] -> Register listeners
  from one bootstrap helper with explicit cleanup and keep duplicate-guard
  logic where needed.
- [Optional endpoint delivery may not represent the final production ingest
  path] -> Treat the emitter as a browser-safe adapter behind the shared
  runtime so later transport changes do not affect feature code.
- [Correlation metadata may be less route-specific if derived centrally] ->
  Include current pathname and shared operation naming in the interceptor so
  protected API requests still carry useful route and operation context.
- [Runtime-contract drift could confuse local setup] -> Update `.env.example`,
  runtime docs, and auth-bootstrap docs in the same implementation change.

## Migration Plan

1. Add the shared frontend observability dependency and app-owned runtime
   bootstrap modules.
2. Extend the runtime store and `.env.example` with the browser-safe
   observability variables required by the integration.
3. Wrap the provider tree with the observability provider and mount the auth,
   error, and Web Vitals bootstrap helpers.
4. Add the router-owned page-view tracker inside the existing route tree.
5. Extend the protected generated-client transport with correlation-header
   injection.
6. Update docs and tests, then run the repo-local validation commands.

Rollback:

- Remove the provider/bootstrap wiring and dependency, restore the previous
  runtime contract, and fall back to the existing protected transport if the
  shared package integration causes regressions.

## Open Questions

- None currently. The shared package contract and the existing `frontend-web`
  bootstrap structure are specific enough to proceed without blocking
  clarification.
