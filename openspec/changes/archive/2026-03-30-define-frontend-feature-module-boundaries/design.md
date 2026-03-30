## Context

`frontend-web` already has the first pieces of a scalable SPA baseline:
`src/app/` holds app-shell UI, `src/routes/` defines route constants,
`src/features/current-user/` contains the first protected page, `src/api/`
holds shared generated-client/query helpers, and `src/stores/` contains runtime
state. That is enough to prove the product flow, but not enough to tell later
features where route files, feature-local UI, stores, and API wrappers belong as
the tree grows.

`P2-T10A` established routing and the protected shell, while `P2-T10B` defined
generated-client and TanStack Query behavior. `P2-T10C` needs to place those
pieces in a stable source layout without re-deciding auth flow, transport
construction, or query semantics. The outcome should be both documented and
embodied in repo structure so developers can infer ownership from the tree
itself.

## Goals / Non-Goals

**Goals:**

- Define a baseline `src/` layout that separates app bootstrap/shell concerns,
  route modules, shared UI, shared API/data-access helpers, feature-owned code,
  and stores.
- Decide whether route files are organized by route ownership or by feature, and
  document how route modules relate to feature folders.
- Define promotion rules that keep single-feature code inside a feature folder
  until it has real cross-feature reuse or app-wide ownership.
- Clarify where app-wide Zustand stores live versus where feature-scoped state
  modules belong.
- Clarify where shared generated-client/query infrastructure lives versus where
  feature-owned wrappers around that infrastructure belong.

**Non-Goals:**

- Re-define generated-client transport, token injection, query-key policy, or
  provisioning behavior already covered by `P2-T10B`.
- Change the route map, auth handoff model, or protected shell behavior already
  covered by `P2-T10A` and `P2-T10D`.
- Introduce a large design-system effort or broad visual refactor.
- Restructure unrelated frontend code outside the baseline route/profile flow
  needed to embody the convention.

## Decisions

### Keep route modules in a route-owned area

- Route entry modules stay under `src/routes/`.
- That area owns path constants, route-tree composition, route guards, and
  route-level layout wrappers.
- Route modules may import feature page modules from `src/features/<feature>/`,
  but feature folders do not own the top-level browser route tree.

Why:

- The protected shell, auth-entry routes, redirects, and nested layout
  composition are route concerns even when the rendered page belongs to a single
  feature.
- A route-owned area keeps URL structure and auth gating easy to audit in one
  place.

Alternative considered:

- Group route files inside each feature folder.
- Rejected because auth boundaries and shared shell composition would be split
  across features before the app has enough route surface to justify that
  complexity.

### Use feature folders as the default home for product code

- Each product feature gets a folder under `src/features/<feature>/`.
- That folder owns the routeable page component plus any feature-local UI,
  hooks, formatters, tests, and feature-specific data-access wrappers.
- If code is only used by one feature, it stays in that feature even if it is
  technically generic-looking.

Why:

- This prevents new work from landing in repo-wide buckets by default and keeps
  ownership close to the behavior it serves.
- It also makes future extraction to shared code intentional instead of
  speculative.

Alternative considered:

- Continue organizing most code by technical type at the top of `src/`.
- Rejected because it scales into a flat tree where ownership is ambiguous and
  feature work quickly scatters across unrelated folders.

### Reserve shared modules for true cross-feature or app-wide concerns

- `src/app/` owns bootstrap providers, auth/bootstrap integration, and app-shell
  modules that are global to the SPA.
- Shared reusable UI lives in a dedicated shared UI area and is limited to
  neutral, cross-feature components or states that are actually reused.
- Code is promoted from feature folders only after it is reused across multiple
  features or clearly belongs to the shell/bootstrap layer.

Why:

- Shared modules should reflect proven ownership, not hypothetical reuse.
- This keeps the codebase from creating a premature dumping ground for
  components, hooks, and helpers with hidden feature coupling.

Alternative considered:

- Move any component or helper that might be reused into shared code early.
- Rejected because speculative sharing increases coupling and makes feature code
  harder to evolve.

### Split shared API infrastructure from feature-owned API wrappers

- `src/api/` remains the shared home for generated-client transport creation,
  query-client bootstrap, canonical error mapping, and other cross-feature
  frontend data-access infrastructure.
- Feature-owned wrappers around that infrastructure, such as current-user query
  hooks or response shaping, live inside the owning feature folder.

Why:

- `P2-T10B` already defined a shared protected API/query baseline, but not every
  query hook belongs in the shared layer.
- Keeping feature-specific wrappers local preserves ownership while still
  reusing the shared transport and error contracts.

Alternative considered:

- Keep all query hooks and API-facing modules under `src/api/`.
- Rejected because feature-specific query composition would accumulate in a
  global folder and lose clear ownership.

### Distinguish app-wide stores from feature-scoped state

- `src/stores/` is reserved for app-wide Zustand stores such as runtime/env
  state or shell-level UI state.
- State that only serves one feature stays inside that feature folder until it
  becomes cross-feature.
- Server state remains in TanStack Query and is not copied into Zustand unless a
  separate client-state need exists.

Why:

- This preserves the existing Zustand baseline while preventing `src/stores/`
  from becoming a second catch-all bucket.
- It also keeps the server-state and client-state boundaries from blurring.

Alternative considered:

- Place every new state module in `src/stores/`.
- Rejected because feature-only state would become globally scattered even when
  there is no shared ownership.

## Risks / Trade-offs

- Route and feature boundaries may feel duplicated at first because route
  modules import feature pages instead of owning them directly -> Keep route
  files thin and focused on path/layout composition.
- Shared UI promotion may feel slower for small teams -> Prefer one deliberate
  extraction later over repeatedly untangling premature shared code.
- Moving the current-user flow into a more explicit feature-owned layout creates
  short-term churn -> Limit implementation to the baseline feature and document
  the pattern clearly so the churn pays off immediately.
- Compatibility docs can drift from the embodied tree -> Include lightweight
  doc updates in the implementation tasks alongside the layout changes.

## Migration Plan

1. Add the new `frontend-module-boundaries` capability and update the protected
   profile capability to require the embodied feature/module layout.
2. Restructure the current protected profile flow so its page and feature-owned
   API wrapper modules live under `src/features/current-user/`, while shared
   generated-client/query/bootstrap modules remain in app/shared areas.
3. Update route modules to import the feature-owned page from the new layout and
   keep route-specific composition inside `src/routes/`.
4. Introduce or confirm the shared UI location and document the promotion rules
   for feature-local versus shared code.
5. Update compatibility docs so the repo describes the new layout as the
   baseline for future protected features.
6. Validate the frontend and archive the change into canonical specs after the
   implementation lands.

## Open Questions

- None currently. The main decisions are about ownership boundaries, and the
  existing routing/data-access baselines provide enough context to define them
  without additional product input.
