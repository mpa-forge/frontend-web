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
- Required local variables:
  - `VITE_APP_ENV`
  - `VITE_API_BASE_URL`
  - `VITE_CLERK_PUBLISHABLE_KEY`
- Optional local variables:
  - `VITE_CLERK_SIGN_IN_URL`
  - `VITE_CLERK_SIGN_UP_URL`

Runtime consumption will be wired when the frontend runtime is introduced in later tasks.

## Run

For native frontend work:

- Start support services from this repo: `make support-up`
- Run the frontend locally: `make run`
- Stop support services: `make support-down`

The local frontend build serves on `http://localhost:3000`.
Support services come from the centralized compose stack in `../platform-infra`.
After code changes, rerun `make run` to rebuild and restart the native frontend.
The frontend exposes a static health endpoint at `http://localhost:3000/healthz`.

## Container

- Build placeholder image: `docker build -t frontend-web:local .`
- Runtime image serves the built frontend bundle and is intended for the local stack baseline in `P1-T06` and `P1-T07`

## Local Stack

- Frontend-focused mode:
  - run `make support-up`
  - run `make run`
  - compose provides `backend-api` on `http://localhost:8080` and Postgres on `localhost:5432`
- API-focused mode is orchestrated from `backend-api`, where compose provides the containerized frontend on `http://localhost:3000`
- Health endpoint: `http://localhost:3000/healthz`

## Test

No automated test suite is configured yet.
Linting, formatting, and test commands will be introduced incrementally in later tasks.
