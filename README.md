# frontend-web

React frontend application repository for the platform blueprint.

## Structure

- `src/`: application source code
- `public/`: static public assets
- `scripts/`: local utility and developer scripts
- `docs/`: frontend-specific documentation

## Toolchain

- GNU Make (or a compatible `make` implementation) and a bash-compatible shell
- Node.js `24.13.1`
- npm `11.8.0`
- Version pin source: `.tool-versions` and `package.json`

## Setup

Before running bootstrap:

- Required: GNU Make (or a compatible `make` implementation) and a bash-compatible shell
- Recommended: `mise` or `asdf` for automatic tool installation from `.tool-versions`
- Fallback: manually install the pinned tool versions listed above

Run the bootstrap command from the repository root:

- Make: `make bootstrap`

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
- Required local variables:
  - `VITE_APP_ENV`
  - `VITE_API_BASE_URL`
  - `VITE_CLERK_PUBLISHABLE_KEY`
- Optional local variables:
  - `VITE_CLERK_SIGN_IN_URL`
  - `VITE_CLERK_SIGN_UP_URL`

Runtime consumption will be wired when the frontend runtime is introduced in later tasks.

## Run

No runnable frontend entrypoint exists yet.
Application bootstrap and local runtime commands will be added in later Phase 1 tasks.

## Test

No automated test suite is configured yet.
Linting, formatting, and test commands will be introduced incrementally in later tasks.
