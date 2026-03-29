# frontend-testing Specification

## Purpose

TBD - created by archiving change expand-frontend-stack. Update Purpose after archive.

## Requirements

### Requirement: Unit and component tests use Vitest

The repository SHALL use Vitest as its unit and component test runner for the
frontend codebase.

#### Scenario: Unit test entrypoint uses Vitest

- **WHEN** the repo-local unit test entrypoint is executed
- **THEN** the frontend unit/component tests run through Vitest

### Requirement: Browser smoke tests use Playwright

The repository SHALL use Playwright for browser-based end-to-end verification of
the frontend shell.

#### Scenario: Browser smoke test launches the built frontend

- **WHEN** the repo-local end-to-end test entrypoint is executed
- **THEN** Playwright starts the frontend and verifies the expected browser
  shell behavior

### Requirement: Initial tests cover the current frontend shell

The initial testing baseline SHALL include at least one unit/component test and
at least one Playwright smoke test covering the current frontend shell.

#### Scenario: Current shell has both fast and browser-level coverage

- **WHEN** the repository test files are inspected
- **THEN** there is at least one Vitest-based test and one Playwright-based
  browser smoke test for the frontend shell
