# Frontend Module Boundaries

This file is a compatibility entry point for the frontend source-layout
baseline. The canonical requirements live in
`openspec/specs/frontend-module-boundaries/spec.md`.

## Baseline Layout

```text
src/
  app/
    providers/
    shell/
  routes/
    auth/
    boundaries/
  features/
    <feature>/
      api/
      components/
      pages/
  ui/
  api/
  stores/
```

## Ownership Rules

- `src/app/` owns app-wide bootstrap providers, auth/bootstrap integration, and
  authenticated shell modules.
- `src/routes/` owns path constants, route-tree composition, auth boundaries,
  and route-level layout wrappers.
- `src/features/<feature>/` is the default home for feature pages,
  feature-local components, tests, transformations, and feature-specific API
  wrappers.
- `src/ui/` is reserved for neutral shared UI that already serves more than one
  feature or clearly belongs to app-wide presentation.
- `src/api/` owns shared generated-client transport, query bootstrap, and
  cross-feature error/query infrastructure.
- `src/stores/` is reserved for app-wide Zustand stores such as runtime or
  shell-level state.

## Promotion Rule

Keep code inside the owning feature folder unless one of these is true:

- the module is already reused across multiple features
- the module belongs to app bootstrap or the authenticated shell
- the module is cross-feature API/query infrastructure
- the module is app-wide Zustand state rather than feature-only client state

Do not move code into `src/ui/`, `src/api/`, or `src/stores/` only because it
looks reusable in theory.

## Boundary Notes

- Route modules import feature pages; feature folders do not own the top-level
  browser route tree.
- Feature-owned query hooks or API wrappers stay in the feature folder even when
  they consume the shared generated-client infrastructure from `src/api/`.
- Server-state behavior remains owned by the routing, generated-client, and
  data-fetching OpenSpec capabilities. This guide only documents where those
  modules live.

## Related Specs

- `openspec/specs/frontend-module-boundaries/spec.md`
- `openspec/specs/frontend-routing-app-shell/spec.md`
- `openspec/specs/frontend-data-fetching-conventions/spec.md`
- `openspec/specs/frontend-state-management/spec.md`
