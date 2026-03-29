# frontend-web

React frontend application repository for the platform blueprint.

## Structure

- `src/`: application source code
- `public/`: static public assets
- `scripts/`: local utility and developer scripts
- `docs/`: compatibility-oriented frontend documentation entrypoints
- `openspec/`: canonical frontend behavior specs and archived change history

Canonical behavior specs:

- `openspec/specs/frontend-runtime/spec.md`
- `openspec/specs/frontend-local-stack/spec.md`
- `openspec/specs/frontend-container-runtime/spec.md`

## Toolchain

- GNU Make (or a compatible `make` implementation) and a bash-compatible shell
- Node.js `24.13.1`
- npm `11.8.0`
- Version pin source: `.tool-versions` and `package.json`

## Setup

Before running bootstrap:

- Shared workspace requirement: keep `platform-blueprint-specs` checked out as a sibling directory if you want to use `make doctor`.
- Required: GNU Make (or a compatible `make` implementation) and a bash-compatible shell
- Recommended: `mise` or `asdf` for automatic tool installation from `.tool-versions`
- Fallback: manually install the pinned tool versions listed above

Run the setup commands from the repository root:

- Workstation checks: `make doctor`
- Bootstrap: `make bootstrap`

Bootstrap installs pinned npm dependencies via `npm ci` and validates the local toolchain.
If `mise` or `asdf` is available, the script will use it to install the pinned toolchain automatically.

## Lint and Format

- Install git hooks: `make precommit-install`
- Run all pre-commit checks manually: `make precommit-run`
- Run repo lint checks: `make lint`
- Apply formatting: `make format`
- Check formatting only: `make format-check`

## Environment

- Copy `.env.example` to `.env` for local development
- Canonical runtime/environment contract:
  - `openspec/specs/frontend-runtime/spec.md`
- Compatibility summary:
  - `docs/frontend-runtime.md`

## Run

For native frontend work:

- Start support services from this repo: `make support-up`
- Run the frontend locally: `make run`
- Stop support services: `make support-down`

- Canonical runtime details:
  - `openspec/specs/frontend-runtime/spec.md`
- Canonical local-stack details:
  - `openspec/specs/frontend-local-stack/spec.md`

## Container

- Build placeholder image: `docker build -t frontend-web:local .`
- Canonical container behavior:
  - `openspec/specs/frontend-container-runtime/spec.md`
- Compatibility summary:
  - `docs/frontend-container-runtime.md`

## Local Stack

- Canonical local-stack behavior:
  - `openspec/specs/frontend-local-stack/spec.md`
- Compatibility summary:
  - `docs/frontend-local-stack.md`

## Test

No automated test suite is configured yet.
Linting, formatting, and test commands will be introduced incrementally in later tasks.
