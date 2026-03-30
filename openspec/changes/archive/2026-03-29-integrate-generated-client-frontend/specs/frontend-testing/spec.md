## MODIFIED Requirements

### Requirement: Initial tests cover the current frontend shell

The initial testing baseline SHALL include at least one unit/component test
covering the generated protected client flow and at least one Playwright smoke
test covering the frontend shell entrypoint.

#### Scenario: Protected frontend flow has fast test coverage

- **WHEN** the repository test files are inspected
- **THEN** there is at least one Vitest-based test covering the generated
  protected client flow

#### Scenario: Frontend shell keeps browser-level smoke coverage

- **WHEN** the repository test files are inspected
- **THEN** there is at least one Playwright-based browser smoke test for the
  frontend shell entrypoint
