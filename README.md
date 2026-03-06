# frontend-web

React frontend application repository for the platform blueprint.

## Structure
- `src/`: application source code
- `public/`: static public assets
- `scripts/`: local utility and developer scripts
- `docs/`: frontend-specific documentation

## Toolchain
- Node.js `24.13.1`
- npm `11.8.0`
- Version pin source: `.tool-versions` and `package.json`

## Setup
Run one of the following bootstrap commands from the repository root:
- PowerShell: `./scripts/bootstrap.ps1`
- POSIX shell: `./scripts/bootstrap.sh`

Bootstrap installs pinned npm dependencies via `npm ci` and validates the local toolchain.
If `mise` or `asdf` is available, the script will use it to install the pinned toolchain automatically.

## Run
No runnable frontend entrypoint exists yet.
Application bootstrap and local runtime commands will be added in later Phase 1 tasks.

## Test
No automated test suite is configured yet.
Linting, formatting, and test commands will be introduced in `P1-T04` and later tasks.
