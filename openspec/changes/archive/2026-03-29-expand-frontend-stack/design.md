## Context

`frontend-web` currently ships with React and Vite, but its package-management
and repo automation baseline still assumes npm, and there is no first-class
unit or browser test layer. The shared platform spec also currently locks npm
as the frontend package-manager baseline, so adopting Bun in the repo has a
small but real cross-repo planning impact.

The requested stack expansion is specific and concrete:

- keep React
- keep Vite
- use Bun instead of npm
- add Vitest
- add Playwright
- add Zustand

For momentum and traceability, the change should do three things together:

1. define the new behavior in OpenSpec
2. implement it in the repo
3. realign shared planning docs that still declare npm as the locked baseline

## Goals / Non-Goals

**Goals:**

- Switch repo-local package-management and script execution from npm to Bun.
- Add stable repo entrypoints for unit/component tests and browser e2e tests.
- Introduce Zustand in a real but minimal way so the state-management baseline
  is present in code, not only in documentation.
- Update runtime/container specs whose behavior changes because of the Bun
  migration.
- Keep the existing frontend runtime surface, local-stack behavior, and health
  endpoint stable while the toolchain changes underneath.

**Non-Goals:**

- Implement the full authenticated app flow, protected routes, or generated
  contract-client integration.
- Change the local-stack topology or frontend container serving model.
- Introduce TanStack Query or React Router in this change.

## Decisions

### Decision: Treat Bun as the repo-local package-manager and script-runner baseline

The repo will switch package management and script execution to Bun, replacing
the npm baseline in `package.json`, `Makefile`, bootstrap flow, and docs.

Node will remain pinned alongside Bun for ecosystem compatibility because Vite,
Playwright, and parts of the JS toolchain still live in the broader Node
ecosystem even when Bun is the primary runner.

Alternative considered:

- Replace both npm and Node immediately. Rejected because it expands the change
  into a broader runtime/tool-compatibility migration with less benefit right
  now.

### Decision: Add both Vitest and Playwright now, but keep the first tests small

Vitest will cover fast unit/component checks, and Playwright will cover the
browser smoke path. The initial tests will stay simple and stable so the repo
gains durable entrypoints without inventing app behavior that does not exist
yet.

Alternative considered:

- Add only Vitest first. Rejected because the requested stack explicitly
  includes a browser test layer, and a single smoke spec is cheap enough to add
  now.

### Decision: Introduce Zustand through a minimal runtime store

The current app shell will read its runtime-display data through a small Zustand
store. That keeps the change real and reviewable without prematurely designing a
larger application state model.

Alternative considered:

- Add Zustand as a dependency but do not use it yet. Rejected because it would
  leave the state-management decision as a hollow dependency-only change.

### Decision: Update shared planning docs that currently lock npm

Because the platform spec and implementation plan currently declare npm as the
frontend tooling baseline, they need to be updated in the same task to avoid a
source-of-truth conflict.

Alternative considered:

- Change only `frontend-web` and leave planning docs stale. Rejected because the
  shared change checklist and documentation rules both call for cross-repo
  alignment when shared behavior changes.

## Risks / Trade-offs

- Bun tooling may not be installed on every workstation yet -> the repo will add
  explicit Bun pinning and bootstrap/check guidance.
- Playwright browser install can add friction on Windows -> keep the first e2e
  check small and document the repo entrypoint clearly.
- Shared planning docs may lag if not updated in the same task -> include that
  work in the implementation checklist.
- The migrated frontend specs currently have placeholder `Purpose` sections ->
  update them while touching the affected capabilities so the canonical docs
  improve instead of staying half-finished.

## Migration Plan

1. Add OpenSpec artifacts for the toolchain/testing/state-management change.
2. Update repo-local tool pins, scripts, Make targets, Bun lockfile, Docker
   build flow, and docs.
3. Add Vitest and Playwright configuration plus one lightweight test in each
   layer.
4. Add a small Zustand store and route the current runtime shell through it.
5. Update the shared planning docs that still lock npm as the frontend baseline.
6. Run validation, then update the OpenSpec task checklist.

## Open Questions

- None. This change treats `vistest` as `vitest` and `zudstand` as `zustand`.
