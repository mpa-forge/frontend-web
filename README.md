# frontend-web

React frontend application repository for the platform blueprint.

## Structure

- `src/`: application source code
  - `src/app/`: app-wide providers and authenticated shell modules
  - `src/routes/`: route-owned path, boundary, and route-tree modules
  - `src/features/`: feature-owned pages, components, and data-access wrappers
  - `src/ui/`: reusable shared UI promoted out of feature folders
  - `src/api/`: shared generated-client/query infrastructure
  - `src/stores/`: app-wide Zustand stores
- `public/`: static public assets
- `scripts/`: local utility and developer scripts
- `docs/`: compatibility-oriented frontend documentation entrypoints
- `openspec/`: canonical frontend behavior specs and archived change history

Canonical behavior specs:

- `openspec/specs/frontend-runtime/spec.md`
- `openspec/specs/frontend-local-stack/spec.md`
- `openspec/specs/frontend-container-runtime/spec.md`
- `openspec/specs/frontend-toolchain/spec.md`
- `openspec/specs/frontend-testing/spec.md`
- `openspec/specs/frontend-state-management/spec.md`
- `openspec/specs/frontend-module-boundaries/spec.md`
- `openspec/specs/frontend-observability-integration/spec.md`

## Toolchain

- GNU Make (or a compatible `make` implementation) and a bash-compatible shell
- Bun `1.3.11`
- Node.js `24.13.1`
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

If this repo consumes published `@mpa-forge/*` packages from GitHub Packages,
export `GITHUB_PACKAGES_TOKEN` before install so the committed `.npmrc` can
authenticate package reads.

- Bootstrap auth details:
  - `docs/frontend-package-consumer-auth.md`
  - `docs/frontend-auth-bootstrap.md`

Bootstrap installs pinned frontend dependencies via Bun and validates the local
toolchain. If `mise` or `asdf` is available, the script will use it to install
the pinned toolchain automatically. The shared frontend observability package is
now consumed from GitHub Packages like the shared contracts client.

## Lint and Format

- Install git hooks: `make precommit-install`
- Run all pre-commit checks manually: `make precommit-run`
- Run repo lint checks: `make lint`
- Run repo unit/component tests: `make test`
- Run repo browser tests: `bun run test:e2e`
- Apply formatting: `make format`
- Check formatting only: `make format-check`

## Environment

- Copy `.env.example` to `.env` for local development
- Frontend auth bootstrap guide:
  - `docs/frontend-auth-bootstrap.md`
- Frontend module-boundary guide:
  - `docs/frontend-module-boundaries.md`
- Frontend observability integration:
  - `openspec/specs/frontend-observability-integration/spec.md`
- Canonical runtime/environment contract:
  - `openspec/specs/frontend-runtime/spec.md`
- Compatibility summary:
  - `docs/frontend-runtime.md`

## Run

For native frontend work:

- Start support services from this repo: `make support-up`
- Force a support-stack image rebuild before starting: `make support-up BUILD=1`
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

- Unit/component testing baseline:
  - `openspec/specs/frontend-testing/spec.md`
- Shared client-state baseline:
  - `openspec/specs/frontend-state-management/spec.md`
- Published package consumer auth bootstrap:
  - `docs/frontend-package-consumer-auth.md`
- Clerk/frontend auth bootstrap:
  - `docs/frontend-auth-bootstrap.md`
