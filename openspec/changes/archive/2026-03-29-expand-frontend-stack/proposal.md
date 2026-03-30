## Why

The frontend repo is still a thin Phase 1 baseline with npm-based tooling, no
automated test stack, and no state-management baseline beyond local component
variables. Expanding the stack now gives the repo a clearer execution model for
app development and testing before the authenticated product flow is built out.

## What Changes

- **BREAKING** Switch the frontend package-manager and script-runner baseline
  from npm to Bun while preserving React and Vite.
- Add a repo-level testing baseline with Vitest for unit/component tests and
  Playwright for browser end-to-end tests.
- Add Zustand as the baseline shared client-state library and wire the current
  runtime shell through a small store so the choice is embodied in code.
- Update repo docs, validation entrypoints, and container build behavior to use
  the new stack.
- Align shared platform planning docs that currently lock npm as the frontend
  package-manager baseline.

## Capabilities

### New Capabilities

- `frontend-toolchain`: Bun-based install/run/lint/test entrypoints, tool pins,
  and repo-local validation expectations.
- `frontend-testing`: Vitest and Playwright test layers, their entrypoints, and
  the baseline coverage they provide in this repo.
- `frontend-state-management`: Zustand as the baseline shared client-state
  model for the frontend repo.

### Modified Capabilities

- `frontend-runtime`: local run behavior changes from npm-driven scripts to
  Bun-driven scripts while preserving the documented runtime surface.
- `frontend-container-runtime`: the build stage switches from npm-based install
  and build commands to Bun-based install and build commands.

## Impact

- `package.json`
- `bun.lock`
- `.tool-versions`
- `Makefile`
- `README.md`
- `Dockerfile`
- `src/`
- test configuration and test files
- `openspec/specs/`
- `../platform-blueprint-specs/platform-specification.md`
- `../platform-blueprint-specs/implementation/implementation-plan.md`
