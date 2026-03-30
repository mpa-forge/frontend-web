## ADDED Requirements

### Requirement: Repo-local frontend package management uses Bun

The repository SHALL use Bun as the frontend package-manager and script-runner
baseline. Repo-local install, lint, build, format, and test entrypoints MUST
execute through Bun rather than npm.

#### Scenario: Bootstrap installs frontend dependencies with Bun

- **WHEN** a developer runs the documented bootstrap flow for this repo
- **THEN** frontend dependency installation is executed through Bun

### Requirement: Tool pins include Bun and preserve Node compatibility

The repository SHALL pin Bun as part of its local toolchain contract, and it
MUST continue to pin Node for ecosystem compatibility with the frontend build
and test tooling.

#### Scenario: Local toolchain checks validate Bun and Node

- **WHEN** a developer runs the repo-local toolchain check entrypoint
- **THEN** the check validates both the Bun baseline and the pinned Node
  baseline

### Requirement: Repo validation includes a Bun-driven test entrypoint

The repository SHALL expose a repo-local `make test` entrypoint backed by Bun,
and that entrypoint MUST run the frontend unit/component test suite.

#### Scenario: Repo test entrypoint runs through Bun

- **WHEN** a developer runs `make test`
- **THEN** the repository executes the configured frontend test suite through
  Bun
