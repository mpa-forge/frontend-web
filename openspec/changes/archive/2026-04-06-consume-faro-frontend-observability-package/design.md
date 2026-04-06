## Context

The previous `frontend-web` integration assumed a custom in-app browser telemetry emitter and treated `VITE_OBSERVABILITY_ENDPOINT` as a frontend-owned transport boundary. `P3-T03B` and `platform-frontend-observability` have both moved since then: the shared package now owns the Grafana Faro client behind a stable wrapper and exposes package-owned React, React Router, and `frontend-web` helpers for the current app boundaries. `frontend-web` therefore needs a smaller integration that consumes those helpers directly and avoids recreating transport or provider logic inside the app.

The current app already has clear ownership boundaries that fit the package:

- `runtimeStore.ts` owns browser env discovery.
- `FrontendAuthProvider.tsx` owns Clerk-derived auth state.
- `AppProviders.tsx` owns app-wide providers.
- `AppRouter.tsx` owns router composition.
- `protectedApiClient.ts` owns the shared protected request transport.

## Goals / Non-Goals

**Goals:**

- Initialize the shared observability runtime once with browser-safe app, environment, release, and ingest inputs.
- Keep provider-specific Faro setup inside `@mpa-forge/platform-frontend-observability` rather than `frontend-web`.
- Use package-owned React/React Router helpers for runtime context, auth-driven user context, and page-view tracking.
- Preserve the existing generated-client boundary while adding shared request-correlation headers to protected requests.
- Document the browser delivery path as the package ingest/Faro path instead of a custom `backend-api` endpoint.

**Non-Goals:**

- Defining or building a new `backend-api` browser telemetry ingest endpoint.
- Exposing raw Grafana Faro APIs, transports, or credentials to app code.
- Adding feature-level telemetry calls throughout page components in this change.
- Solving provider provisioning or secret delivery work owned by `P3-T01`, `P3-T02`, or `P3-T05`.

## Decisions

### Decision: Add one app-owned bootstrap module that only normalizes app inputs

`frontend-web` will create one local bootstrap/runtime module that reads env values from the runtime store, maps them into `createFrontendObservability(...)`, and wraps the tree with `FrontendObservabilityProvider`. The app-owned module will stay thin: it can choose app name, release fallback behavior, and whether local development logs or no-ops when observability is disabled, but it will not create custom transport code or import Grafana Faro directly.

Alternatives considered:

- Recreate the earlier custom emitter layer in `frontend-web`. Rejected because it duplicates behavior the shared package now owns and conflicts with the updated `P3-T03B` direction.
- Initialize the runtime inline inside `AppProviders.tsx`. Rejected because a dedicated bootstrap module keeps env normalization and test seams isolated from provider composition.

### Decision: Consume package-owned React Router and frontend-web helpers instead of bespoke adapters

Route tracking will use the shared React Router helper and auth/request boundaries will use the shared `frontend-web` helpers. `frontend-web` may still provide thin local wrappers where it needs app-specific inputs such as the auth snapshot shape or route naming, but those wrappers will call the package helper APIs rather than rebuilding telemetry behavior locally.

Alternatives considered:

- Keep app-local page-view and auth synchronization modules. Rejected because the package now ships those convenience layers explicitly for `frontend-web`.
- Push tracking into feature pages or data hooks. Rejected because `P3-T03B` calls for app-shell-level integration without bespoke wiring in page components.

### Decision: Treat observability config as browser-safe runtime inputs only

The runtime contract will add a required release identifier and optional observability enablement and ingest values. These values remain browser-safe and must not include provider secrets or prebuilt auth headers. The ingest endpoint is the provider-supported Faro/Grafana browser delivery URL exposed through the package contract, not a custom app-owned ingest API.

Alternatives considered:

- Add new frontend-held auth headers, tokens, or secret env vars. Rejected because both the package spec and Phase 3 task forbid browser-held secrets.
- Point `VITE_OBSERVABILITY_ENDPOINT` at a `backend-api` ingest route. Rejected because the task now explicitly prefers the provider-supported frontend observability path over a custom endpoint.

### Decision: Extend the protected generated-client boundary with shared correlation headers

The existing protected generated-client interceptor chain will stay the single place where bearer tokens and observability correlation are attached. The change will add package-generated request context headers next to the Clerk `Authorization` header so backend traces can correlate protected browser requests without adding feature-local request code.

Alternatives considered:

- Add correlation headers in each feature hook or service call. Rejected because it scatters contract logic and makes coverage incomplete.
- Delay correlation until a future backend endpoint exists. Rejected because the shared package already exposes provider-neutral request-correlation helpers and `P3-T03B` requires protected-flow correlation now.

## Risks / Trade-offs

- [Provider-supported browser ingest details may continue to evolve] → Keep all provider-specific assumptions inside the shared package and keep `frontend-web` limited to browser-safe env passthrough.
- [Auth snapshot shape may drift from current Clerk hooks] → Use the package's `frontend-web` helpers at the boundary and keep the local auth snapshot mapping minimal and test-covered.
- [Route naming and route-template fidelity may be imperfect in the first pass] → Start with router-owned path tracking and document any later need for richer route-template mapping as a follow-up change instead of blocking the baseline.
- [Tests can become brittle if they mock provider internals] → Mock the shared package entrypoints or runtime contract from `frontend-web` tests rather than mocking Grafana Faro directly.
