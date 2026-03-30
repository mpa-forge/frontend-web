## Context

`frontend-web` now has a protected route and app-shell baseline, plus a generated contracts package that exposes the user-service API surface. What is still missing is the shared frontend-side integration pattern: where the generated Connect transport lives, how Clerk bearer tokens are attached, how environment-driven API base URLs are resolved, and how protected queries and mutations are modeled so feature code does not invent its own fetch flow.

This change is cross-cutting inside the frontend repo because it touches auth-aware API access, TanStack Query usage, and the first protected feature page that will consume the pattern. It also needs a stable design before implementation so later protected features can reuse the same client and query conventions instead of rebuilding them page by page.

## Goals / Non-Goals

**Goals:**

- Define one reusable auth-aware generated-client wiring path for `@mpa-forge/platform-contracts-client`.
- Define the baseline TanStack Query bootstrap and conventions for protected generated reads and writes.
- Make the protected current-user flow the first real consumer of the shared pattern.
- Keep the frontend bootstrap and runtime docs aligned with the new API-access baseline.

**Non-Goals:**

- Change backend contracts or the Clerk dashboard configuration.
- Introduce a broad application-wide state layer for server data beyond TanStack Query.
- Implement unrelated route/module-boundary work that belongs to later `P2-T10C`.
- Redesign the visual app shell beyond what is needed to host the protected data flow.

## Decisions

### Use one shared generated-client module

- Create a single frontend-owned integration layer that builds the Connect transport and generated `UserService` client from `@mpa-forge/platform-contracts-client`.
- Resolve the API base URL from `VITE_API_BASE_URL` in that layer instead of passing it ad hoc from features.
- Keep package imports package-based, not sibling-repo relative.

Why:

- This keeps generated-client consumption consistent and future-proof when the package source changes from local workspace to GitHub Packages.

Alternative considered:

- Let each feature build its own client locally.
- Rejected because it would duplicate auth/header logic and drift query/error behavior immediately.

### Attach Clerk bearer tokens through the shared transport path

- Inject the current Clerk bearer token in the shared transport/interceptor path used by protected generated calls.
- Keep token acquisition out of feature-local request code.

Why:

- The repo already treats Clerk as the auth baseline, and token/header logic is cross-cutting rather than feature-specific.

Alternative considered:

- Put token injection inside each feature hook.
- Rejected because it repeats security-sensitive logic and makes auth failures inconsistent.

### Use TanStack Query as the baseline server-state layer for protected flows

- Add `@tanstack/react-query` as a frontend dependency and bootstrap one root `QueryClientProvider` from the app entrypoint.
- Model generated reads and writes through TanStack Query hooks/helpers instead of manual `useEffect` + local loading/error flags.
- Keep query-key ownership and mutation sequencing explicit in the shared convention.

Why:

- React Router owns route structure, while TanStack Query is already the chosen frontend stack piece for async server data.
- This gives later features a reusable pattern for stale/loading/error behavior.
- Making the dependency and provider part of this change keeps the pattern executable instead of leaving bootstrap ownership implicit.

Alternative considered:

- Keep the first protected flow manual and defer conventions.
- Rejected because `P2-T10B` exists specifically to prevent one-off fetch patterns from becoming the baseline.

### Provision first, then read

- The protected current-user flow should call `EnsureCurrentUserProfile` before reading `GetCurrentUser`.
- Treat the provisioning step as an idempotent bootstrap mutation and the read step as the stable profile query keyed for the current authenticated user.

Why:

- This matches the backend contract added in `P2-T09` and keeps provisioning separate from read behavior.

### Keep query-key ownership inside the shared data-access layer

- The shared TanStack Query layer owns canonical query keys for generated protected data, beginning with the current-user profile key used after provisioning.
- Features consume shared hooks/helpers instead of inventing new keys for the same server resource.

Why:

- `P2-T10B` is meant to establish one reusable query pattern. That requires shared ownership of the keys and the mutation-then-query sequence, not just a library choice.

Alternative considered:

- Collapse the flow into a single profile read in the frontend.
- Rejected because it would hide the explicit backend provisioning contract and make first-login behavior less clear.

## Risks / Trade-offs

- Shared client helpers can become a dumping ground for feature-specific logic -> Keep the layer limited to transport, token injection, error normalization, and small reusable query helpers.
- TanStack Query conventions may feel heavy for one page -> The first protected flow is intentionally the proving ground for a pattern we expect later features to reuse.
- Clerk token acquisition failures may be surfaced more directly to the UI -> Define a narrow error-mapping contract so protected pages can distinguish auth, configuration, and API failures cleanly.
- Docs may drift if the OpenSpec change lands without compatibility updates -> Implementation tasks should include the related `docs/` updates before archive.

## Migration Plan

1. Add or update the shared generated-client integration module and protected query/mutation helpers.
2. Add the TanStack Query dependency and bootstrap one root provider in the frontend entrypoint.
3. Refactor the protected current-user page to use the shared bootstrap-then-read pattern.
4. Update frontend runtime/auth bootstrap docs to reference the shared API-access layer.
5. Validate with repo-local unit/browser checks.
6. Archive the change into canonical specs after implementation and verification.

## Open Questions

- None currently. The frontend should follow the backend's explicit provisioning contract and the existing Clerk SPA bearer-token model.
